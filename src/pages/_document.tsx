import Document from "next/document";
import { Context } from "react-free-style";
import { renderer } from "../style";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: React.FC) => (props: any) => (
          <Context.Provider value={renderer}>
            <App {...props} />
          </Context.Provider>
        ),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {renderer.toComponent()}
        </>
      ),
    };
  }
}
