import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from "@expo/vector-icons/Ionicons";

//Get your API key from the QR-Answers app
const apiKey = "api_e138069b91e24cbd81329394de4b5c6506605ad690d340cbbf96931d1ff16b66";
const qranswers = require("qranswers")(apiKey);

export default function App() {
  const [fetchingProjects, setFetchingProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState({});   // indexed by projectId
  const [fetchingLocations, setFetchingLocations] = useState({});   // indexed by projectId
  const [questions, setQuestions] = useState({});   // indexed by projectId
  const [fetchingQuestions, setFetchingQuestions] = useState({});   // indexed by projectId
  const [answers, setAnswers] = useState({});   // indexed by questionId
  const [fetchingAnswers, setFetchingAnswers] = useState({});   // indexed by questionId
  const [campaigns, setCampaigns] = useState({});   // indexed by projectId
  const [fetchingCampaigns, setFetchingCampaigns] = useState({});   // indexed by projectId

  useEffect(() => {
    async function initQR() {
      const initApiOk = await qranswers.api.initialize();      
      
      const initOk = await qranswers.subscriptions.initialize();
      if (initOk) {
        const sub = qranswers.subscriptions.subscribeToAllResponses((response) => {
          console.log('response', response);
        })
        return sub;
      }
    }

    const sub = initQR();

    return () => {
      qranswers.subscriptions.unsubscribeToAllResponses(sub);
    }
  }, []);

  // Projects are retrieved based on your API Key
  const fetchProjects = async () => {
    setFetchingProjects(true);
    const projRet = await qranswers.api.getProjectList();
    setFetchingProjects(false);
    // returns {success: 'success', data: [...]} or {error: 'error message'}
    if (projRet.data) {
      setProjects(projRet.data);
    } else {
      console.log(projRet);
    }
  };

  // Locations are retrieved based on the project ID
  const fetchLocations = async (projectId) => {
    setFetchingLocations({...fetchingLocations, [projectId]: true});
    const getRes = await qranswers.api.getLocationList(projectId);
    if (getRes.data) {
      var newList = {...locations};
      newList[projectId] = getRes.data;
      newList[projectId].visible = true;
      setLocations(newList);
    } else {
      console.log(getRes);
    }
    setFetchingLocations({...fetchingLocations, [projectId]: false});
  };

  // Questions are retrieved based on the project ID
  const fetchQuestions = async (projectId) => {
    setFetchingQuestions({...fetchingQuestions, [projectId]: true});
    const getRes = await qranswers.api.getQuestionList(projectId);
    if (getRes.data) {
      var newList = {...questions};
      newList[projectId] = getRes.data;
      newList[projectId].visible = true;
      setQuestions(newList);
    } else {
      console.log(getRes);
    }
    setFetchingQuestions({...fetchingQuestions, [projectId]: false});
  };

  // Answers are retrieved based on the Question ID
  const fetchAnswers = async (questionId) => {
    setFetchingAnswers({...fetchingAnswers, [questionId]: true});
    const getRes = await qranswers.api.getAnswerList(questionId);
    if (getRes.data) {
      var newList = {...answers};
      newList[questionId] = getRes.data;
      newList[questionId].visible = true;
      setAnswers(newList);
    } else {
      console.log(getRes);
    }
    setFetchingAnswers({...fetchingAnswers, [questionId]: false});
  };

  // Campaigns are retrieved based on the project ID
  const fetchCampaigns = async (projectId) => {
    setFetchingCampaigns({...fetchingCampaigns, [projectId]: true});
    const getRes = await qranswers.api.getCampaignList(projectId);
    if (getRes.data) {
      var newList = {...campaigns};
      newList[projectId] = getRes.data;
      newList[projectId].visible = true;
      setCampaigns(newList);
    } else {
      console.log(getRes);
    }
    setFetchingCampaigns({...fetchingCampaigns, [projectId]: false});
  };

  const renderLocations = (projectId) => {
    if (locations[projectId] && locations[projectId].visible) {
      return (
        <View style={{ marginLeft: 16 }}>
          {locations[projectId].map((location, index) => {
            return (
              <View key={location.id} style={{backgroundColor: index % 2 == 0 ? '#bbbbff' : '#ddddff'}}>
                <Text style={{ color: 'black', fontSize: 18 }}>Location ID: {location.id}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Name: {location.name}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Description: {location.description}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Tags: {location.tags}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Latitude: {location.latitude}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Longitude: {location.longitude}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        UpdatedAt: {location.updatedAt}</Text>
              </View>
            )
          })}
        </View>
      )
    } else {
      return null;
    }
  }

  const renderQuestions = (projectId) => {
    if (questions[projectId] && questions[projectId].visible) {
      return (
        <View style={{ marginLeft: 16 }}>
          {questions[projectId].map((question, index) => {
            return (
              <View key={question.id}>
              <View style={{backgroundColor: index % 2 == 0 ? '#ffbbbb' : '#ffdddd'}}>
                <Text style={{ color: 'black', fontSize: 18 }}>Question ID: {question.id}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Text: {question.text}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Description: {question.description}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Tags: {question.tags}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        UpdatedAt: {question.updatedAt}</Text>
              </View>

                <Pressable style={{
                  paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10,
                  flexDirection: 'row', backgroundColor: 'rgb(192,192,192)'
                }}
                  onPress={() => {
                    if (!answers[question.id] && !fetchingAnswers[question.id]) {
                      fetchAnswers(question.id);
                    }
                    if (answers[question.id] && answers[question.id].hasOwnProperty('visible')) {
                      var newList = { ...answers };
                      newList[question.id].visible = !newList[question.id].visible;
                      setAnswers(newList);
                    }
                  }}>
                  <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Answers</Text>
                  <Ionicons
                    name={answers[question.id] && answers[question.id].visible ? "chevron-up" : "chevron-down"}
                    color={'white'}
                    size={24}
                  />
                </Pressable>
                {fetchingAnswers[question.id] &&
                  <ActivityIndicator size="large" color="#0000ff" />
                }
                {renderAnswers(question.id)}

              </View>
            )
          })}
        </View>
      )
    } else {
      return null;
    }
  }

  const renderAnswers = (questionId) => {
    const getAnswerType = (ansType) => {
      switch (ansType) {
        case 0:
          return 'TEXT';
        case 1:
          return 'IMAGE';
        case 2:
          return "BOTH";
        default:
          return 'Unknown';
      }
    }

    if (answers[questionId] && answers[questionId].visible) {
      return (
        <View style={{ marginLeft: 16 }}>
          {answers[questionId].map((answer, index) => {
            return (
              <View key={answer.id} style={{backgroundColor: index % 2 == 0 ? '#ffffbb' : '#ffffdd'}}>
                <Text style={{ color: 'black', fontSize: 18 }}>Answer ID: {answer.id}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Text: {answer.text}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Description: {answer.description}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Tags: {answer.tags}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Type: {getAnswerType(answer.ansType)}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        ImageUrl: {answer.imageUrl}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Link: {answer.link}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        LinkAction: {answer.linkAction}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        LinkDescription: {answer.linkDescription}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        UpdatedAt: {answer.updatedAt}</Text>
              </View>
            )
          })}
        </View>
      )
    } else {
      return null;
    }
  }

  const renderCampaigns = (projectId) => {
    const getDispositionText = (disposition) => {
      switch (disposition) {
        case 0:
          return 'DRAFT';
        case 1:
          return 'ACTIVE';
        case 2:
          return 'INACTIVE';
        default:
          return 'Unknown';
      }
    }

    if (campaigns[projectId] && campaigns[projectId].visible) {
      return (
        <View style={{ marginLeft: 16 }}>
          {campaigns[projectId].map((campaign, index) => {
            return (
              <View key={campaign.id} style={{backgroundColor: index % 2 == 0 ? '#bbffbb' : '#ddffdd'}}>
                <Text style={{ color: 'black', fontSize: 18 }}>Campaign ID: {campaign.id}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Name: {campaign.name}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Abbreviation: {campaign.abbreviation}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Description: {campaign.description}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Tags: {campaign.tags}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Disposition: {getDispositionText(campaign.disposition)}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Settings: {JSON.stringify(campaign.settings)}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        Schedule: {campaign.schedule}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        UpdatedAt: {campaign.updatedAt}</Text>
              </View>
            )
          })}
        </View>
      )
    } else {
      return null;
    }
  }
  const renderProjectGroups = (thisProject) => {

    return (
      <View>
        <Pressable style={{ 
          paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, 
          flexDirection: 'row', backgroundColor: 'rgb(160,160,160)' }}
          onPress={() => {
            if (!locations[thisProject.id] && !fetchingLocations[thisProject.id]) {
              fetchLocations(thisProject.id);
            }
            if (locations[thisProject.id] && locations[thisProject.id].hasOwnProperty('visible')) {
              var newLocs = { ...locations };
              newLocs[thisProject.id].visible = !newLocs[thisProject.id].visible;
              setLocations(newLocs);
            }

          }}>
          <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Locations</Text>
          <Ionicons
            name={locations[thisProject.id] && locations[thisProject.id].visible ? "chevron-up" : "chevron-down"}
            color={'white'}
            size={24}
          />
        </Pressable>
        {fetchingLocations[thisProject.id] &&
          <ActivityIndicator size="large" color="#0000ff" />
        }
        {renderLocations(thisProject.id)}

        <View style={{height: 2, backgroundColor: 'white'}}></View>

        <Pressable style={{ 
          paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, 
          flexDirection: 'row', backgroundColor: 'rgb(160,160,160)' }}
          onPress={() => {
            if (!questions[thisProject.id] && !fetchingQuestions[thisProject.id]) {
              fetchQuestions(thisProject.id);
            }
            if (questions[thisProject.id] && questions[thisProject.id].hasOwnProperty('visible')) {
              var newList = { ...questions };
              newList[thisProject.id].visible = !newList[thisProject.id].visible;
              setQuestions(newList);
            }

          }}>
          <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Questions</Text>
          <Ionicons
            name={questions[thisProject.id] && questions[thisProject.id].visible ? "chevron-up" : "chevron-down"}
            color={'white'}
            size={24}
          />
        </Pressable>
        {fetchingQuestions[thisProject.id] &&
          <ActivityIndicator size="large" color="#0000ff" />
        }
        {renderQuestions(thisProject.id)}


        <View style={{height: 2, backgroundColor: 'white'}}></View>

        <Pressable style={{ 
          paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, 
          flexDirection: 'row', backgroundColor: 'rgb(160,160,160)' }}
          onPress={() => {
            if (!campaigns[thisProject.id] && !fetchingCampaigns[thisProject.id]) {
              fetchCampaigns(thisProject.id);
            }
            if (campaigns[thisProject.id] && campaigns[thisProject.id].hasOwnProperty('visible')) {
              var newList = { ...campaigns };
              newList[thisProject.id].visible = !newList[thisProject.id].visible;
              setCampaigns(newList);
            }

          }}>
          <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Campaigns</Text>
          <Ionicons
            name={campaigns[thisProject.id] && campaigns[thisProject.id].visible ? "chevron-up" : "chevron-down"}
            color={'white'}
            size={24}
          />
        </Pressable>
        {fetchingQuestions[thisProject.id] &&
          <ActivityIndicator size="large" color="#0000ff" />
        }
        {renderCampaigns(thisProject.id)}

      </View>
    )
  }


  const renderProjects = () => {
    if (projects && projects.length > 0) {
      return (
        <View style={{width: '100%'}}>
          <Text style={{fontSize: 22, topMargin: 16, bottomMargin: 16}}>Open the Accordions to Demonstrate Other APIs</Text>
          {projects.map((thisProject) => {
            return (
              <View key={thisProject.id}>
                <Pressable style={{
                  paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, 
                  flexDirection: 'row', backgroundColor: 'rgb(128,128,128)' }}
                  onPress={() => {
                    var newProjects = [...projects];
                    var ix = newProjects.findIndex((proj) => proj.id == thisProject.id);
                    newProjects[ix].visible = !newProjects[ix].visible;
                    setProjects(newProjects);
                  }
                  }>
                  <Text style={{ color: 'white', fontSize: 20, paddingRight: 10 }}>{thisProject.name}</Text>
                  <Ionicons
                    name={thisProject.visible ? "chevron-up" : "chevron-down"}
                    color={'white'}
                    size={24}
                  />
                </Pressable>
                {thisProject.visible &&
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ color: 'black', fontSize: 18 }}>Project ID: {thisProject.id}</Text>
                    <Text style={{ color: 'black', fontSize: 18 }}>        Name: {thisProject.name}</Text>
                    <Text style={{ color: 'black', fontSize: 18 }}>        Abbreviation: {thisProject.abbreviation}</Text>
                    <Text style={{ color: 'black', fontSize: 18 }}>        Description: {thisProject.description}</Text>
                    <Text style={{ color: 'black', fontSize: 18 }}>        Tags: {thisProject.tags}</Text>
                    <Text style={{ color: 'black', fontSize: 18 }}>        UpdatedAt: {thisProject.updatedAt}</Text>
                    {renderProjectGroups(thisProject)}
                  </View>
                }
              </View>
            )
          })
          }
        </View>
      )
    } else {
      return null;
    }
  }

  return (
    <ScrollView scrollEnabled={true} contentContainerStyle={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}
    >
      {!projects || projects.length == 0 &&
        <View style={{marginLeft: 16}}>
          <Text style={{marginTop: 16}}>QR-Answers API Tester</Text>
          <Pressable style={{ width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5, marginTop: 10 }}
            onPress={() => {
              fetchProjects();
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Get Projects</Text>
          </Pressable>
        </View>
      }
      {fetchingProjects &&
        <ActivityIndicator size="large" color="#0000ff" />}
      {renderProjects()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
