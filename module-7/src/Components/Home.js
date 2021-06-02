import React, { Component } from 'react';
import {Header, Form, Button} from 'semantic-ui-react';
import { withRouter } from "react-router";
import PropTypes from "prop-types";

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            address: "0x"
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    render() {
        // const { match, location, history } = this.props;
        return (
            <div>
                <Header as='h1'>Crowdfunding Application</Header>
                <Form>
                    <Form.Input 
                        label='address'
                        type = 'text'
                        value = {this.state.address}
                        onChange = {this.onChange}
                        />
                        <Button
                            type='submit'
                            onClick = {this.onSubmit}>Submit</Button>
                </Form>
                
            </div>
        );
    }

    onChange(event) {
        this.setState({address: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.history.push(`/campaign/${this.state.address}`);
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };
}

export default withRouter(Home);