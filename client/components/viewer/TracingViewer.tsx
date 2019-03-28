import * as React from "react";
import {Grid} from "semantic-ui-react";

import {SceneManager} from "../../three/sceneManager";

export class TracingViewer extends React.Component<{}, {}> {
    private _sceneManager: SceneManager;

    public componentDidMount() {
        this.createViewer();
    }

    private createViewer() {
        const container = document.getElementById("viewer-container");

        this._sceneManager = new SceneManager(container);

        this._sceneManager.animate();
    }

    public render() {
        return (
            <Grid>
                <Grid.Row columns={16}>
                    <Grid.Column width={12}>
                        <div id="viewer-container" style={{height: "500px"}}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}
