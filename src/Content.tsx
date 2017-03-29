import * as React from "react";

import {Tracings} from "./Tracings";
import {UntransformedSwc} from "./UntransformedSwc";

interface IContentProps {
}

interface IContentState {
}

export class Content extends React.Component<IContentProps, IContentState> {
    public render() {
        return (
            <div>
                <UntransformedSwc/>
                <Tracings/>
            </div>
        );
    }
}
