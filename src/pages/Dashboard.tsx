import {
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { VizReactFlow } from '../components/VizReactFlow';
import { YAMLEditor } from '../components/YAMLEditor';
import request from '../utils/request';
import * as React from 'react';
import { IViewData } from "../types";

/**
 * Temporarily providing initial YAML data
 */
const exampleData = 'apiVersion: camel.apache.org/v1alpha1\n' +
  'kind: KameletBinding\n' +
  'metadata:\n' +
  '  name: twitter-search-source-binding\n' +
  'spec:\n' +
  '  source:\n' +
  '    ref:\n' +
  '      kind: Kamelet\n' +
  '      apiVersion: camel.apache.org/v1alpha1\n' +
  '      name: twitter-search-source\n' +
  '    properties:\n' +
  '      keywords: "Apache Camel"\n' +
  '      apiKey: "your own"\n' +
  '      apiKeySecret: "your own"\n' +
  '      accessToken: "your own"\n' +
  '      accessTokenSecret: "your own"\n' +
  '  sink:\n' +
  '    ref:\n' +
  '      kind: Kamelet\n' +
  '      apiVersion: camel.apache.org/v1alpha1\n' +
  '      name: kafka-sink\n' +
  '    properties:\n' +
  '      brokers: "The Brokers"\n' +
  '      password: "The Password"\n' +
  '      topic: "The Topic Names"\n' +
  '      username: "The Username"\n';

const Dashboard = () => {
  const [jsonData, setJsonData] = React.useState<IViewData>({});
  const [yamlData, setYamlData] = React.useState(exampleData || '');

  const getData = async (incomingData) => {
    const resp = await request.post({
      endpoint: '/viewdefinition?' + new URLSearchParams({
        yaml: incomingData
      }),
      contentType: 'text/yaml'
    });

    const data = await resp.json();

    //console.log('data? ' + JSON.stringify(data));
    setJsonData(data);
    //console.log('response.json: ' + JSON.stringify(data.json));
    //return data;
  }

  /**
   * On detected changes to YAML state, issue POST to external endpoint
   * Returns JSON to be displayed in the visualizer
   */
  const handleChanges = (incomingData: string) => {
    setYamlData(incomingData);

    return getData(incomingData)
    .then(() => {
      console.log('I am here now..');
      return;
    })
    .catch((err) => {
      console.log('Something went wrong..', err);
      return err;
    });

    /**
    try {
      request.post({
        endpoint: '/viewdefinition?' + new URLSearchParams({
          yaml: incomingData
        }),
        contentType: 'text/yaml'
      })
      .then((res) => res.json())
      .then((data) => {
        console.log('response data: ' + JSON.stringify(data));
        setJsonData(data);
        //return data;
      })
      .catch((err) => {
        console.log('Something went wrong..', err);
        //return err;
      });
    } catch(err) {
      // Catch error here
      console.log(err.name + ': ' + err.message);
    }
     **/

    /**
    request.post({
      endpoint: '/viewdefinition?' + new URLSearchParams({
        yaml: incomingData
      }),
      contentType: 'text/yaml'
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('response.json: ' + JSON.stringify(data.json));
      setJsonData(data.json);

      //return setJsonData(data.json);
      //return data;
    })
    .catch((err) => {
      console.log('Something went wrong..', err);
      //return err;
    });
     **/
    /**
    try {

    } catch(err) {
      // Catch error here
      console.log(err.name + ':' + err.message);
    }
     **/
  };

  return (
    <>
      <Grid>
        <GridItem span={6}>
          <YAMLEditor yamlData={ yamlData } handleChanges={handleChanges} />
        </GridItem>
        <GridItem span={6}>
          <VizReactFlow viewData={jsonData}/>
        </GridItem>
      </Grid>
    </>
  );
};

export { Dashboard };
