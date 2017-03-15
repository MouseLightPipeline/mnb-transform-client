"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var React = require("react");
//import {Table} from "react-bootstrap";
var react_table_1 = require("react-table");
require("react-table/react-table.css");
var moment = require("moment");
var react_apollo_1 = require("react-apollo");
var graphql_tag_1 = require("graphql-tag");
function formatCoordinates(node) {
    if (node) {
        return "(" + node.x.toFixed(4) + ", " + node.y.toFixed(4) + ", " + node.z.toFixed(4) + ")";
    }
    else {
        return "n/a";
    }
}
function formatUpdatedAt(updatedAt) {
    return moment(new Date(this.props.tracing.updatedAt)).fromNow().toLocaleString();
}
var columns = [{
        header: "Id",
        accessor: "id",
        render: function (props) { return <span className="number">{props.value.slice(0, 8)}</span>; } // Custom cell components!
    }, {
        header: "Source",
        accessor: function (tracing) { return tracing.swcTracing ? tracing.swcTracing.filename : ""; }
    }, {
        header: "Nodes",
        accessor: "nodeCount"
    }, {
        header: "Transform",
        accessor: function (tracing) { return tracing.registrationTransform ? tracing.registrationTransform.name : ""; }
    }, {
        header: "Node 1 SWC",
        accessor: function (tracing) { return tracing.swcTracing ? formatCoordinates(tracing.swcTracing.firstNode) : ""; }
    }, {
        header: "Node 1 Allen",
        accessor: function (tracing) { return formatCoordinates(tracing.firstNode); }
    }, {
        header: "Registration Applied",
        accessor: function (tracing) { return formatUpdatedAt(tracing.updatedAt); }
    }];
/*
 class TracingRow extends React.Component<ITracingRowProps, ITracingRowState> {
 public render() {
 const updatedAt = moment(new Date(this.props.tracing.updatedAt)).fromNow();

 return (<tr>
 <td>{this.props.tracing.id.slice(0, 8)}</td>
 <td>{this.props.tracing.swcTracing ? this.props.tracing.swcTracing.filename : ""}</td>
 <td>{this.props.tracing.nodeCount}</td>
 <td>{this.props.tracing.registrationTransform ? this.props.tracing.registrationTransform.name : ""}</td>
 <td>{this.props.tracing.swcTracing ? this.formatCoordinates(this.props.tracing.swcTracing.firstNode) : ""}</td>
 <td>{this.formatCoordinates(this.props.tracing.firstNode)}</td>
 <td>{updatedAt.toLocaleString()}</td>
 </tr>
 );
 }
 }
 */
var tracingsQuery = (_a = ["{\n  tracings {\n    id\n    nodeCount\n    firstNode {\n      sampleNumber\n      parentNumber\n      id\n      x\n      y\n      z\n    }\n    createdAt\n    updatedAt\n    swcTracing {\n      id\n      annotator\n      filename\n      fileComments\n      offsetX\n      offsetY\n      offsetZ\n      firstNode {\n        sampleNumber\n        parentNumber\n        id\n        x\n        y\n        z\n      }\n    }\n    registrationTransform {\n      id\n      name\n      notes\n      location\n    }\n    nodes {\n      id\n    }\n  }\n}"], _a.raw = ["{\n  tracings {\n    id\n    nodeCount\n    firstNode {\n      sampleNumber\n      parentNumber\n      id\n      x\n      y\n      z\n    }\n    createdAt\n    updatedAt\n    swcTracing {\n      id\n      annotator\n      filename\n      fileComments\n      offsetX\n      offsetY\n      offsetZ\n      firstNode {\n        sampleNumber\n        parentNumber\n        id\n        x\n        y\n        z\n      }\n    }\n    registrationTransform {\n      id\n      name\n      notes\n      location\n    }\n    nodes {\n      id\n    }\n  }\n}"], graphql_tag_1.default(_a));
var TracingsTable = (function (_super) {
    __extends(TracingsTable, _super);
    function TracingsTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TracingsTable.prototype.refreshTimestamps = function () {
        var _this = this;
        //if (this.props.data && !this.props.data.loading) {
        //     this.props.data.refetch()
        // }
        this._timeout = setTimeout(function () { return _this.refreshTimestamps(); }, 1000);
    };
    TracingsTable.prototype.componentDidMount = function () {
        //this._timeout = setTimeout(() => this.refreshTimestamps(), 1000);
    };
    TracingsTable.prototype.componentWillUnmount = function () {
        clearTimeout(this._timeout);
    };
    TracingsTable.prototype.render = function () {
        var tracings = (this.props.data && !this.props.data.loading) ? this.props.data.tracings : [];
        // const rows = tracings.map(tracing => (<TracingRow key={`tr_${tracing.id}`} tracing={tracing}/>));
        return (<react_table_1.ReactTable data={tracings} columns={columns}/>);
        /*
         return (
         <Table condensed>
         <thead>
         <tr>
         <th>Id</th>
         <th>Source</th>
         <th>Nodes</th>
         <th>Transform</th>
         <th>Node 1 SWC</th>
         <th>Node 1 Transformed</th>
         <th>Registration Applied</th>
         </tr>
         </thead>
         <tbody>
         {rows}
         </tbody>
         </Table>
         );*/
    };
    return TracingsTable;
}(React.Component));
TracingsTable = __decorate([
    react_apollo_1.graphql(tracingsQuery, {
        options: {
            pollInterval: 5 * 1000
        }
    })
], TracingsTable);
exports.TracingsTable = TracingsTable;
var _a;
