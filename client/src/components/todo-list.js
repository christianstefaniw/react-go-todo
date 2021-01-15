import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";
import {DELETE_TASK_URL, TASK_URL, UNDO_TASK_URL} from "../constants/api-constants";


class TodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: "",
            items: []
        };
    }

    componentDidMount() {
        this.getTask();
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    onSubmit = () => {
        let { task } = this.state;
        if (task) {
            axios
                .post(
                    TASK_URL,
                    {
                        task
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                )
                .then(res => {
                    this.getTask();
                    this.setState({
                        task: ""
                    });
                });
        }
    };

    getTask = () => {
        axios.get(TASK_URL).then(res => {
            if (res.data) {
                this.setState({
                    items: res.data.map(item => {
                        let color = "yellow";
                        let cardBackground = { background: "white" };
                        let style = {
                            wordWrap: "break-word",
                        };

                        if (item.status) {
                            style["textDecorationLine"] = "line-through";
                            color = "green";
                            cardBackground.background = "beige";
                        }
                        return (
                            <Card key={item._id} color={color} style={cardBackground} fluid>
                                <Card.Content>
                                    <Card.Header textAlign="left">
                                        <div style={style}>{item.task}</div>
                                    </Card.Header>

                                    <Card.Meta textAlign="right">
                                        <Icon
                                            link
                                            name="check circle"
                                            color="green"
                                            onClick={() => this.updateTask(item._id)}
                                        />
                                        <span style={{ paddingRight: 10 }}>Done</span>
                                        <Icon
                                            link
                                            name="undo"
                                            color="yellow"
                                            onClick={() => this.undoTask(item._id)}
                                        />
                                        <span style={{ paddingRight: 10 }}>Undo</span>
                                        <Icon
                                            link
                                            name="delete"
                                            color="red"
                                            onClick={() => this.deleteTask(item._id)}
                                        />
                                        <span style={{ paddingRight: 10 }}>Delete</span>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        );
                    })
                });
            } else {
                this.setState({
                    items: []
                });
            }
        });
    };

    updateTask = id => {
        axios
            .put(TASK_URL + '/' + id, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(res => {
                this.getTask();
            });
    };

    undoTask = id => {
        axios
            .put(UNDO_TASK_URL + id, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(res => {
                this.getTask();
            });
    };

    deleteTask = id => {
        axios
            .delete(DELETE_TASK_URL + id, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(res => {
                console.log(res);
                this.getTask();
            });
    };
    render() {
        return (
            <div>
                <div className="row">
                    <Header className="header" as="h2">
                        TO DO LIST
                    </Header>
                </div>
                <div className="row">
                    <Form onSubmit={this.onSubmit}>
                        <Input
                            type="text"
                            name="task"
                            onChange={this.onChange}
                            value={this.state.task}
                            fluid
                            placeholder="Create Task"
                        />
                        {/* <Button >Create Task</Button> */}
                    </Form>
                </div>
                <div className="row">
                    <Card.Group>{this.state.items}</Card.Group>
                </div>
            </div>
        );
    }
}

export default TodoList;