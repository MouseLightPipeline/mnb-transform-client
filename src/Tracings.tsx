import * as React from "react";

import {TracingsTable} from "./TracingsTable";

interface ITracingsProps {
}

interface ITracingsState {
}

export class Tracings extends React.Component<ITracingsProps, ITracingsState> {

    public render() {
        return (
            <TracingsTable/>
        );
    }
}
