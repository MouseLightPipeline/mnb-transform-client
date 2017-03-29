import * as React from "react";
import {Grid, Row, Col, Pagination, FormControl} from "react-bootstrap";

interface IPaginationHeaderProps {
    pageCount: number;
    activePage: number;

    onUpdateOffsetForPage(page: number): void;
}

interface IPaginationHeaderState {
    pageTextValue?: string;
}

export class PaginationHeader extends React.Component<IPaginationHeaderProps, IPaginationHeaderState> {
    public constructor(props: IPaginationHeaderProps) {
        super(props);

        this.state = {
            pageTextValue: ""
        }
    }

    private onPageTextChanged(evt: any) {
        this.setState({pageTextValue: evt.target.value});
    }

    private onKeyPress(evt: any) {
        if (evt.charCode === 13) {
            const page = parseInt(this.state.pageTextValue);

            if (!isNaN(page) && page > 0 && page <= this.props.pageCount) {
                this.props.onUpdateOffsetForPage(page);
            }
        }
    }

    public componentWillReceiveProps(nextProps: IPaginationHeaderProps) {
        if (nextProps.activePage != this.props.activePage) {
            this.setState({pageTextValue: nextProps.activePage.toString()});
        }
    }

    private renderGrid() {
        return (
            <Grid>
                <Row>
                    <Col sm={8}>
                        <Pagination prev next first last ellipsis boundaryLinks items={this.props.pageCount}
                                    maxButtons={10}
                                    activePage={this.props.activePage}
                                    onSelect={(page: any) => {this.props.onUpdateOffsetForPage(page)}}/>
                    </Col>
                    <Col sm={2}>
                        <FormControl style={{marginTop: "21px", marginBottom:"21px"}} type="text"
                                     value={this.state.pageTextValue} onKeyPress={(evt: any) => this.onKeyPress(evt)}
                                     onChange={(evt: any) => this.onPageTextChanged(evt)}/>
                    </Col>
                    <Col sm={2}>
                    </Col>
                </Row>
            </Grid>
        );
    }

    public render() {
        return this.props.pageCount > 1 ? this.renderGrid() : null;
    }
}
