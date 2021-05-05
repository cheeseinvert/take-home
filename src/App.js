import React, {useEffect, useState} from 'react';
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import BootstrapTable from 'react-bootstrap-table-next';
import './App.css';

const apiEndpoint = 'https://us-central1-infinitus-interviews.cloudfunctions.net/take-home-b';
const logo = "https://uploads-ssl.webflow.com/5edab43874bee80a65301d12/5edab43874bee852b5301d3d_infinitus-logo.svg"

function App() {
  const [capabilities, setCapabilities] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect( () => {
      if (capabilities) {
          setCategories(Object.keys(capabilities));
      }
  }, [capabilities]);

  useEffect(() => {
    (async () => {
          let response = await window.fetch(apiEndpoint);
          let currentCapabilities = await response.json();
          let categorizedCapabilities = {};
          currentCapabilities.forEach(c => {
              if (!categorizedCapabilities.hasOwnProperty(c.category)) {
                  categorizedCapabilities[c.category] = [];
              }
              categorizedCapabilities[c.category].push(c);
          });
          setCapabilities(categorizedCapabilities);
    })()
  }, []);


  function renderCapabilitiesTable(category) {
      const columns = [ {
          dataField: 'title',
          text: 'Capability Title',
          sort: true
      }, {
          dataField: 'enabled',
          text: 'isEnabled?',
          sort: true
      }];
      const defaultSorted = [{
          dataField: 'enabled',
          order: 'asc'
      }];
      let data = [];
      capabilities[category].forEach(capability => {
          let {title, enabled} = capability;
          data.push({title, enabled: enabled ? "✅" : "❌"});
      })
      return <BootstrapTable keyField='title' data={ data } columns={ columns } size="lg" defaultSorted={defaultSorted} bootstrap4 />
  }

  function renderCategories() {
      let cards = [];
      categories.forEach( (categoryName, index) => {
          cards.push(<Card>
              <Card.Header>
               <Accordion.Toggle as={Button} variant="link" eventKey={categoryName}>
                   {categoryName}
              </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey={categoryName}>
              <Card.Body>{renderCapabilitiesTable(categoryName)}</Card.Body>
              </Accordion.Collapse>
              </Card>)
      })
      return (<Accordion>{cards}</Accordion>)

  }

  if (capabilities && categories) {
      return (
          <div className="App">
              <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1>Frontend Takehome Interview</h1>
                  <span>Submitted by candidate <a href={"mailto:adammgrant@gmail.com"}>Adam Grant</a></span>
                  <h5>Click on category below to check specific capability status:</h5>
              </header>
              {renderCategories()}
          </div>
      )
  } else {
      return (
          <>loading...</>
      )
  }
}

export default App;
