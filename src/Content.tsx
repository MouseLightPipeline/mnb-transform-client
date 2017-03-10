import * as React from "react";

import {Tracings} from "./Tracings";

interface IContentProps {
}

interface IContentState {
}

export class Content extends React.Component<IContentProps, IContentState> {
    public render() {
        return (
            <div>
                <Tracings/>
            </div>
        );
    }
}
