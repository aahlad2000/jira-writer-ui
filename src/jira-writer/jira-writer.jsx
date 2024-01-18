import { useRef, useState } from "react";
import "./jira-writer.css";
import Loading from "../loading/Loading";

const JiraWriter = () => {
  const queryRef = useRef(null);
  const [hideResultBox, setHideResultBox] = useState(true);
  const [hideValidation, setValidation] = useState(true);
  const [fetchedValue, setFetchedValue] = useState("");
  const [isLoading, setLoading] = useState(false);

  function checkValidation(enteredQuery) {
    if (enteredQuery.toLowerCase().includes("write a jira about")) {
      setValidation(true);
      return true;
    } else {
      setValidation(false);
      return false;
    }
  }

  function handleClick() {
    const enteredQuery = queryRef.current.value;
    const shouldMakeAPICall = checkValidation(enteredQuery);
    if (shouldMakeAPICall) {
      setLoading(true);
      try {
        fetch("http://localhost:8080/get/openAiResponse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enteredQuery),
        })
          .then((response) => {
            return response.text();
          })
          .then((data) => {
            setLoading(false);
            console.log("fetched the resposne: ", data);
            responseHandler(hideValidation);
            setFetchedValue(data);
          });
      } catch (exception) {
        setLoading(false);
        responseHandler(hideValidation);
        console.log(exception);
        alert("Sorry, unable to get response OpenAI from API");
      }
    } else {
      responseHandler(hideValidation);
    }
  }

  function responseHandler(hideValidation) {
    if (hideValidation) {
      setHideResultBox(false);
    } else {
      setHideResultBox(true);
    }
  }

  return (
    <div className="jira-writer-component">
      <h1 className="heading">Jira Writer</h1>
      <br></br>
      <div className="container" hidden={isLoading}>
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
          <button
            id="copy-to-clipboard"
            onClick={() => navigator.clipboard.writeText(fetchedValue)}
          >
            Copy
          </button>
          <textarea value={fetchedValue} readOnly></textarea>
        </div>
      </div>
      <div className="loading-spinner" hidden={!isLoading}>
        <Loading />
      </div>
    </div>
  );
};

export default JiraWriter;
