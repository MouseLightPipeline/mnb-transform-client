import gql from "graphql-tag";
import {Query} from "react-apollo";

export const SYSTEM_MESSAGE_QUERY = gql`query SystemMessage {
    systemMessage
}`;

type SystemMessageQueryResponse = {
    systemMessage: string;
}

export class SystemMessageQuery extends Query<SystemMessageQueryResponse, {}>{}