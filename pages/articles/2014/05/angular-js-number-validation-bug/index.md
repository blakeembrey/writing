---
title: Avoid type="number" in AngularJS
date: 2014-05-09 20:00
author: Blake Embrey
layout: article
---

The other day I got hit by a peculiar bug in Angular. Using `type="number"` on an input element wouldn't do any number validation. On top of this, when I entered an invalid number the only validation failing was `required`.

After a little research, it turned out to be a ["feature"](http://www.w3.org/TR/html5/forms.html#number-state-%28type=number%29) of blocking access to the `value` attribute when it's an invalid number. Not all browsers follow the complete spec, so I found this was working in Firefox. Back in Chrome however, it was failing. You can even test this in the [AngularJS documentation](https://docs.angularjs.org/api/ng/input/input%5Bnumber%5D) by typing an invalid number in the demo and looking at the error message.

## Custom Type Directive

~~~javascript
var app = angular.module('myApp', []);

/**
 * Provide custom type validation for input elements. Certain type attributes
 * don't work consistenty cross-browser, so this is a required workaround.
 * Looking at you, webkit and `type="number"`.
 *
 * ```html
 * <input
 *   ng-model=""
 *   app-type="">
 * ```
 */
app.directive('appType', function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      // Custom number validation logic.
      if (attrs.appType === 'number') {
        return ctrl.$parsers.push(function (value) {
          var valid = value == null || isFinite(value);

          ctrl.$setValidity('number', valid);

          return valid && value != null ? Number(value) : undefined;
        });
      }
    }
  };
});
~~~

The code above adds a new custom directive that requires `ngModel`. Requiring `ngModel` provides us with the [ngModelController](http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController). Using the controller we can access some useful methods, including model input parsing and validity - which makes up the bulk of our validation logic.

When the type is `number`, we push a custom parser onto the stack. Our parser goes on the end and will run after any other parsers, allowing us to keep the `required` directive in tact. The validity itself checks if the value is empty (`null` or `undefined`) or that it's a valid JavaScript number. Valid "JavaScript number" is important to note, since this will allow the most comprehensive check including integers, floats, negative and positive notation, but also other notations such as `0x1e5` and `1e5`.

Validity gets set next and based on the result we'll coerce the value into a number. By doing number coercion, the model will correctly receive the number instead of the string representation. We want to avoid coercing empty values (`null` and `undefined`) however, which will come out as `0` and `NaN` respectfully.

## Recreating min and max directives

~~~javascript
var app = angular.module('myApp', []);

/**
 * Provide minimum number validation for any input.
 *
 * ```html
 * <input
 *   ng-model=""
 *   app-min="">
 * ```
 */
app.directive('appMin', function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      return ctrl.$parsers.push(function (value) {
        var valid = value == null || Number(value) >= Number(attrs.appMin);

        ctrl.$setValidity('min', valid);

        return valid ? value : undefined;
      });
    }
  };
});
~~~

Recreating the `min` directive is trivial and we can easily make it work for any input. The above validation does the `null` check again, which will make an empty input element valid. This is important since we don't want to provide unnecessary validation and bundle the `required` directives job into ours.

Next it's just a process of coercing both the value and attribute into numbers and comparing the values. If either are `NaN`, validation will fail. This provides some form of ensuring we have numbers only, but won't do any number coerce to the model. Finally, we return either the value or `undefined` if validation failed.

## Unit Testing

Unit testing the functionality was straightforward enough, so I won't provide all the code used. A couple of things worth mentioning though is how to compile the templates for testing and set the values for validation.

```javascript
it('...', function () {
  inject(function ($compile, $rootScope) {
    var $scope = $rootScope.$new();

    $scope.model = {};

    var $element = $compile(
      '<form name="form">' +
      '  <input name="num" ng-model="model.value" app-type="number">' +
      '</form>'
    )($scope);

    // Set the value to what you want to test.
    $scope.form.num.$setViewValue('10');

    // Check the model is what you expect and check validation.
    $scope.model.value.should.equal(10);
    $scope.form.num.$invalid.should.be.false;
  });
});
```
