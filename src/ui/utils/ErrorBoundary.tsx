import React, {ErrorInfo} from "react";
import {WithChild} from "./improvedapi/Element";

export interface ErrorBoundaryProps extends WithChild {
    fallback: JSX.Element
}
export interface ErrorBoundaryState {
    hasError: boolean;
}
export class ErrorBoundary extends React.Component<ErrorBoundaryProps,ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    // eslint-disable-next-line class-methods-use-this
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        //    logErrorToMyService(error, errorInfo);
        // return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback;
        }

        return this.props.children;
    }
}