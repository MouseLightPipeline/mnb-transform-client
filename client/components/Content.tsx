import * as React from "react";

import {Tracings} from "./tracings/Tracings";
import {UntransformedContainer} from "./untransformed/UntransformedContainer";


export const Content = () => (
    <div>
        <UntransformedContainer/>
        <Tracings/>
    </div>
);
