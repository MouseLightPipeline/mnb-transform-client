import * as React from "react";

import {Tracings} from "./tracings/Tracings";
import {UntransformedContainer} from "./untransformed/UntransformedContainer";

interface IContentProps {
}

interface IContentState {
}

export class Content extends React.Component<IContentProps, IContentState> {
    public render() {
        return (
            <div>
                <UntransformedContainer/>
                <Tracings/>
            </div>
        );
    }
}
