import React, { Component } from "react";
import axios from "axios";
import e from "express";

class CreateForm extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            mini: "",
            destination: "",
            hasError: false,
            errorMessage: ""
        }
    }
    
    _handleCreateMini = (e) => {
        e.preventDefault();
        console.log("submitted");
    }

    render() {
        return (
            <div>
                <form onSubmit={this._handleCreateMini}>
                    <input id="mini" type="text"/>
                    <input id="destination" type="text"/>
                    <input type="submit"/>
                </form>
            </div>
        )
    }
}

export default CreateForm;
