import React, { useState } from "react";
import { Toast, ToastBody, ToastHeader, Button, Alert } from "reactstrap";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";
import Link from "@editorjs/link";
import axios from "axios";
import "./style/textfield.css";

const editor = new EditorJS({
  tools: {
    header: Header,
    list: List,
    image: Image,
    paragraph: Paragraph,
    link: {
      class: Link,
      config: {
        endpoint: "http://localhost:4000/linkpreview"
      }
    }
  },
  holder: "editorjs",
  autofocus: true,
  placeholder: "Let`s write an awesome story!"
});

editor.isReady
  .then(() => {
    console.log("Editor.js is ready to work!");
  })
  .catch(reason => {
    console.log(`Editor.js initialization failed because of ${reason}`);
  });

const TextApp = props => {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("Submit Post");
  const [btnStatus, setBtnStatus] = useState(false);
  let submitPost = () => {
    setMsg("Pls Wait!");
    setBtnStatus(!btnStatus);
    editor
      .save()
      .then(outputData => {
        axios
          .post(`http://localhost:4000/postblog`, { data: outputData })
          .then(response => {
            console.log(response.data);
            editor.blocks.clear();
            setMsg("Submit Post");
            setBtnStatus(true);
            setShow(!show);
          })
          .catch(err => {
            alert(err);
          });
      })
      .catch(error => {
        console.log("Saving failed: ", error);
      });
  };
  return (
    <div className="wrapper">
      <Alert color="success">
        <h4 className="alert-heading">Hey Welcome!</h4>
        <p>
          This is my simple solution to #1 Project : Build a Content Creation
          Tool with React on{" "}
          <a href="https://degreelessdeveloper.com/d/14-101-javascript-projects-1-build-a-content-creation-tool-with-react">
            Degreeless Developer
          </a>
          .
        </p>
        <hr />
        <p className="mb-0">Write Awesome Stories With EditorJS</p>
      </Alert>
      <div className="p-3 my-2 rounded">
        <Toast isOpen={show}>
          <ToastHeader>Hey</ToastHeader>
          <ToastBody>Post was saved successfully...</ToastBody>
        </Toast>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h4>Note.</h4>
            <ol>
              <li>
                It only stores the data, I have not figured out how to convert
                it into readable data. As it is all Json.
              </li>
              <li>
                <a href="https://github.com/mayorityz/content-creation-with-react-and-editorjs">
                  Here
                </a>{" "}
                on Github
              </li>
              <li>I didn't do any validation or routes protection</li>
            </ol>
          </div>
          <div className="col-md-8">
            <div id="editorjs"></div>
            <hr />
            <Button
              color="primary"
              block
              onClick={submitPost}
              disabled={btnStatus}
            >
              {msg}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextApp;
