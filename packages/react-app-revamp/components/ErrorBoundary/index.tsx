import { Component } from "react";

/*
 Prevents the page from crashing.
 See https://nextjs.org/docs/advanced-features/error-handling or https://reactjs.org/docs/error-boundaries.html
*/

class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    //@ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-10 my-4">Jokes on us !</h2>
          <p>
            {" "}
            Looks like this page can&apos;t be displayed for now — we might be rate limited by our{" "}
            <a href="https://alchemy.com/blog/what-is-a-node-provider" rel="noreferrer" target="_blank">
              node provider
            </a>
            . <br /> <span className="font-bold">Please just refresh in one minute.</span>
          </p>
        </div>
      );
    }

    // Return children components in case of no error
    //@ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
