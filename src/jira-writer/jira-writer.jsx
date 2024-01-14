import { useRef, useState } from "react";
import "./jira-writer.css";

const JiraWriter = () => {
  const queryRef = useRef(null);
  const [hideResultBox, setHideResultBox] = useState(true);
  const [hideValidation, setValidation] = useState(true);
  const [fetchedValue, setFetchedValue] = useState("");

  function checkValidation(enteredQuery) {
    if (enteredQuery.toLowerCase().includes("write a jira about")) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  }

  async function handleClick() {
    const enteredQuery = queryRef.current.value;
    checkValidation(enteredQuery);
    if (!hideValidation) {
      try {
        const response = await fetch(
          "http://localhost:8080/get/openAiResponse",
          {
            mode: "no-cors",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(enteredQuery),
          }
        );

        responseHandler(hideValidation);

        if (response.ok) {
          setFetchedValue(response);
        } else {
          setFetchedValue("Error occured while calling OpenAI API");
        }
      } catch (exception) {
        alert("Sorry, unable to get response OpenAI from API");
      }
    } else {
      responseHandler(hideValidation);
    }
  }

  function responseHandler(hideValidation) {
    if (!hideValidation) {
      setHideResultBox(false);
    } else {
      setHideResultBox(true);
    }
  }

  return (
    <div className="jira-writer-component">
      <h1 className="heading">Jira Writer</h1>
      <br></br>
      <div className="query-box">
        <p>Describe what your Jira is about:</p>
        <textarea ref={queryRef}></textarea>
      </div>
      <br></br>
      <button onClick={handleClick}>SUBMIT</button>
      <br></br>
      <br></br>
      <small hidden={hideValidation} className="validtion-tag">
        Please use the correct query format
      </small>
      <div className="response-box" hidden={hideResultBox}>
        <textarea value={fetchedValue} readOnly></textarea>
      </div>
    </div>
  );
};

export default JiraWriter;
