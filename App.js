import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Pressable, Platform } from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Linking from 'expo-linking';

//Get your API key from the QR-Answers app
//const apiKey = "api_e138069b91e24cbd81329394de4b5c6506605ad690d340cbbf96931d1ff16b66";
const apiKey = "api_1f817529b1ad4f47b9297158be132ca8031469e2abb14dc6ac90b61a8f0e69e2";
const qranswers = require("qranswers")(apiKey);

export default function App() {
  const [qrInited, setQrInited] = useState(false);

  const [fetchingProjects, setFetchingProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState({});   // indexed by projectId
  const [fetchingLocations, setFetchingLocations] = useState({});   // indexed by projectId
  const [canRemoveLocations, setCanRemoveLocations] = useState({});   // indexed by projectId
  const [questions, setQuestions] = useState({});   // indexed by projectId
  const [fetchingQuestions, setFetchingQuestions] = useState({});   // indexed by projectId
  const [canRemoveQuestions, setCanRemoveQuestions] = useState({});   // indexed by projectId
  const [answers, setAnswers] = useState({});   // indexed by questionId
  const [fetchingAnswers, setFetchingAnswers] = useState({});   // indexed by questionId
  const [canRemoveAnswers, setCanRemoveAnswers] = useState({});   // indexed by questionId
  const [campaigns, setCampaigns] = useState({});   // indexed by projectId
  const [fetchingCampaigns, setFetchingCampaigns] = useState({});   // indexed by projectId
  const [projectId, setProjectId] = useState(null);
  const [campStat, setCampStat] = useState('active');

  useEffect(() => {
    if (qrInited) {
      const sub = qranswers.subscriptions.subscribeToAllResponses((response) => {
        console.log('response', response);
      })
      return () => {
        // Subscriptions need cleaned up when the component unmounts
        qranswers.subscriptions.unsubscribeToAllResponses(sub);
      }
    }
}, [qrInited]);

  useEffect(() => {
    async function initQR() {
      const initOk = await qranswers.subscriptions.initialize();
      setQrInited(initOk);
    }

    const sub = initQR();
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

  const fetchResponseDetailsListByProject = async (projectId) => {
    const getRes = await qranswers.api.getResponseDetailsListByProject(projectId);
    if (getRes.data) {
      console.log(getRes.data);
    } else {
      console.log(getRes);
    }
  }

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
    const getRes = await qranswers.api.getCampaignList(projectId, campStat);
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
                <View style={{flexDirection: 'row'}}>
                  <Pressable style={{
                    width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5,
                  }}
                    onPress={async () => {
                      let newList = showCheckingCanRemoveLocations(location.id, projectId);
                      await canRemoveLocation(location.id, projectId);
                      hideCheckingCanRemoveLocations(newList, location.id, projectId);
                    }}>
                    <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Can remove?</Text>
                  </Pressable>
                  {canRemoveLocations[projectId] && canRemoveLocations[projectId].includes(location.id) ?
                    <ActivityIndicator size="small" color="#0000ff" />
                    : null}
                  {location.canRemove ?
                    <Text style={{padding: 10}}>{location.canRemove}</Text>
                    : null}
                </View>
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
                <View style={{ backgroundColor: index % 2 == 0 ? '#ffbbbb' : '#ffdddd' }}>
                  <Text style={{ color: 'black', fontSize: 18 }}>Question ID: {question.id}</Text>
                  <Text style={{ color: 'black', fontSize: 18 }}>        Text: {question.text}</Text>
                  <Text style={{ color: 'black', fontSize: 18 }}>        Description: {question.description}</Text>
                  <Text style={{ color: 'black', fontSize: 18 }}>        Tags: {question.tags}</Text>
                  <Text style={{ color: 'black', fontSize: 18 }}>        UpdatedAt: {question.updatedAt}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Pressable style={{
                      width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5,
                    }}
                      onPress={async () => {
                        let newList = showCheckingCanRemoveQuestion(question.id, projectId);
                        await canRemoveQuestion(question.id, projectId);
                        hideCheckingCanRemoveQuestions(newList, question.id, projectId);
                      }}>
                      <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Can remove?</Text>
                    </Pressable>
                    {canRemoveQuestions[projectId] && canRemoveQuestions[projectId].includes(question.id) ?
                    <ActivityIndicator size="small" color="#0000ff" />
                    : null}
                    {question.canRemove ?
                      <Text style={{ padding: 10 }}>{question.canRemove}</Text>
                      : null}
                  </View>
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
                {renderAnswers(question.id, projectId)}

              </View>
            )
          })}
        </View>
      )
    } else {
      return null;
    }
  }

  const renderAnswers = (questionId, projectId) => {
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
                <View style={{flexDirection: 'row'}}>
                  <Pressable style={{
                    width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5,
                  }}
                    onPress={async () => {
                      let newList = showCheckingCanRemoveAnswers(questionId, answer.id);
                      await canRemoveAnswer(answer.id, questionId, projectId);
                      hideCheckingCanRemoveAnswers(newList, questionId, answer.id);
                    }}>
                    <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Can remove?</Text>
                  </Pressable>
                  {canRemoveAnswers[questionId] && canRemoveAnswers[questionId].includes(answer.id) ?
                    <ActivityIndicator size="small" color="#0000ff" />
                    : null}
                  {answer.canRemove ?
                    <Text style={{padding: 10}}>{answer.canRemove}</Text>
                    : null}
                </View>

              </View>
            )
          })}
        </View>
      )
    } else {
      return null;
    }
  }
  const openAsPageInNewTab = (vault) => {
		var url = `https://go.qr-answers.com/camparch/${vault}`;
		if (Platform.OS === 'web') {
			window.open(url, '_blank');
		} else {
			Linking.openURL(url);
		}
  }
  const showCampaignArchiveIndicator = (campaignId, projectId, show) => {
    let newList = { ...campaigns };
    let fndCamp = newList[projectId].find((camp) => camp.id == campaignId);
    fndCamp.activityIndicator = show;
    setCampaigns(newList);
  }
  const toggleCampaignDownload = (campaignId, projectId) => {
    let newList = { ...campaigns };
    let fndCamp = newList[projectId].find((camp) => camp.id == campaignId);
    fndCamp.download = !fndCamp.download;
    setCampaigns(newList);
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
                <Text style={{ color: 'black', fontSize: 18 }}>        RecordStatus: {campStat}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>        UpdatedAt: {campaign.updatedAt}</Text>
                <View style={{ flexDirection: 'row' }}>
                  {campStat == 'active' ?
                    <View style={{ flexDirection: 'row' }}>
                      <Pressable style={{
                        width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5,
                      }}
                        onPress={async () => {
                          showCampaignArchiveIndicator(campaign.id, projectId, true);
                          const res = await qranswers.api.archiveCampaign(campaign.id, projectId, campaign.download);
                          if (res.success && res.vault) {
                            openAsPageInNewTab(res.vault)
                          }
                          showCampaignArchiveIndicator(campaign.id, projectId, false);
                          console.log(res);
                          fetchCampaigns(projectId);
                        }}>
                        <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Archive</Text>
                      </Pressable>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                          color='black'
                          status={campaign.download ? 'checked' : 'unchecked'}
                          onPress={() => {
                            toggleCampaignDownload(campaign.id, projectId);
                          }} />
                        <Text style={{ color: 'black' }}>Download</Text>
                      </View>

                    </View>

                    :
                    <Pressable style={{
                      width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5,
                    }}
                      onPress={async () => {
                        showCampaignArchiveIndicator(campaign.id, projectId, true);
                        const res = await qranswers.api.unarchiveCampaign(campaign.id, projectId);
                        showCampaignArchiveIndicator(campaign.id, projectId, false);
                        console.log(res);
                        fetchCampaigns(projectId);
                      }}>
                      <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Unarchive</Text>
                    </Pressable>
                  }
                  {campaign.activityIndicator ?
                    <ActivityIndicator size="small" color="#0000ff" />

                    : null}
                </View>
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
              var newList = { ...locations };
              newList[thisProject.id].visible = !newList[thisProject.id].visible;
              setLocations(newList);
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

        <View style={{
          paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10,
          flexDirection: 'row', backgroundColor: 'rgb(160,160,160)'
        }}>
          <Pressable style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              value='active'
              color='white'
              status={campStat == 'active' ? 'checked' : 'unchecked'}
              onPress={() => {
                setCampaigns({});
                setCampStat('active')
              }} />
            <Text style={{ color: 'white' }}>Active</Text>
            <RadioButton
              value='archive'
              color='white'
              status={campStat == 'archive' ? 'checked' : 'unchecked'}
              onPress={() => {
                setCampaigns({});
                setCampStat('archive')
              }} />
            <Text style={{ color: 'white' }}>Archived</Text>
          </View>
        </View>
        {fetchingCampaigns[thisProject.id] &&
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

  // Upate name to "API Updated Project"
  const updateProject = async (pid) => {
    try {
      const projectParams = {
        name: 'API Updated Project',
        description: 'This project was updated by the QR-Answers API Tester'
      }
      const res = await qranswers.api.updateProject(pid, projectParams);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }


  const createProject = async () => {
    try {
      const projectParams = {
        name: 'QR-Answers API Tester',
        abbreviation: 'QAT',
        tags: [{name: 'test'}, {name: 'api'}],
        description: 'This project was created by the QR-Answers API Tester'
      }
      const res = await qranswers.api.createProject(projectParams);

      if (res.success) {
        setProjectId(res.data.id);
      }

      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  const showCheckingCanRemoveLocations = (locationId, projectId) => {
    let rmList = { ...canRemoveLocations };
    rmList[projectId] = rmList[projectId] || [];
    rmList[projectId].push(locationId);
    setCanRemoveLocations(rmList);
    return rmList;
  }
  const hideCheckingCanRemoveLocations = (rmList, locationId, projectId) => {
    rmList[projectId] = rmList[projectId].filter((loc) => loc != locationId);
    setCanRemoveLocations(rmList);
  }

  const showCheckingCanRemoveQuestion = (questionId, projectId) => {
    let rmList = { ...canRemoveQuestions };
    rmList[projectId] = rmList[projectId] || [];
    rmList[projectId].push(questionId);
    setCanRemoveQuestions(rmList);
    return rmList;
  }
  const hideCheckingCanRemoveQuestions = (rmList, questionId, projectId) => {
    rmList[projectId] = rmList[projectId].filter((loc) => loc != questionId);
    setCanRemoveQuestions(rmList);
  }
  const showCheckingCanRemoveAnswers = (questionId, answerId) => {
    let rmList = { ...canRemoveAnswers };
    rmList[questionId] = rmList[questionId] || [];
    rmList[questionId].push(answerId);
    setCanRemoveAnswers(rmList);
    return rmList;
  }
  const hideCheckingCanRemoveAnswers = (rmList, questionId, answerId) => {
    rmList[questionId] = rmList[questionId].filter((loc) => loc != answerId);
    setCanRemoveAnswers(rmList);
  }

  const canRemoveLocation = async (locationId, projectId) => {
    try {      
      const res = await qranswers.api.canRemoveLocation(locationId, projectId);
      if (res.success && res.id) {
        // if res.used, res.campaigns is a list of campaigns that use this location and have votes 
        // if campaigns[] is empty, then there are no votes or responses that use this location
        let newList = {...locations};
        let fndLoc = newList[projectId].find((loc) => loc.id == locationId);
            if (res.used) {
          // You may delete the location, but there are votes/responses for that location
          if (!res.campaigns || res.campaigns.length == 0) {
            // if res.used is true, but there are no votes/responses that use this location
            fndLoc.canRemove = 'This location is used, but has no votes';
          } else {
            fndLoc.canRemove = 'This location is used in campaigns: ' + res.campaigns.map((c) => c).join(', ');
          }
        } else {
          // if res.used is false, then there are no votes/responses that use this location
          // deleteLocation(locationId, projectId);
          fndLoc.canRemove = 'This location is not used';
        }
        setLocations(newList);
      } else {
        console.error(res);
      }
    } catch (err) {
      console.log(err);
    }

  }

  const canRemoveQuestion = async (questionId, projectId) => {
    try {
      const res = await qranswers.api.canRemoveQuestion(questionId, projectId);
      if (res.success && res.id) {
        // if res.used, res.campaigns is a list of campaigns that use this location and have votes 
        // if campaigns[] is empty, then there are no votes or responses that use this location
        let newList = {...questions};
        let fndLoc = newList[projectId].find((loc) => loc.id == questionId);
        if (res.used) {
          // You may delete the location, but there are votes/responses for that location
          if (!res.campaigns || res.campaigns.length == 0) {
            // if res.used is true, but there are no votes/responses that use this location
            fndLoc.canRemove = 'This question is used, but has no votes';
          } else {
            fndLoc.canRemove = 'This question is used in campaigns: ' + res.campaigns.map((c) => c).join(', ');
          }
        } else {
          // if res.used is false, then there are no votes/responses that use this location
          // deleteLocation(locationId, projectId);
          fndLoc.canRemove = 'This question is not used';
        }
        setQuestions(newList);
      } else {
        console.error(res);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const canRemoveAnswer = async (answerId, questionId, projectId) => {
    try {
      const res = await qranswers.api.canRemoveAnswer(answerId, questionId, projectId);
      if (res.success) {
        // if res.used, res.campaigns is a list of campaigns that use this location and have votes 
        // if campaigns[] is empty, then there are no votes or responses that use this location
        let newList = {...answers};
        let fndLoc = newList[questionId].find((loc) => loc.id == answerId);
        if (res.used) {
          // You may delete the location, but there are votes/responses for that location
          // res.campaigns = [{campaignId: <>, aid: answerId, qid: questionid}...]
          if (!res.campaigns || res.campaigns.length == 0) {
            // if res.used is true, but there are no votes/responses that use this location
            fndLoc.canRemove = 'This answer is used, but has no votes';
          } else {
            fndLoc.canRemove = 'This answer is used in campaigns: ' + res.campaigns.map((c) => c.campaignId).join(', ');
          }
        } else {
          // if res.used is false, then there are no votes/responses that use this location
          // deleteLocation(locationId, projectId);
          fndLoc.canRemove = 'This answer is not used';
        }
        setAnswers(newList);
      } else {
        console.error(res);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const renderHierarchy = () => {
    return (
      <ScrollView scrollEnabled={true} contentContainerStyle={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}
      >
        {!projects || projects.length == 0 &&
          <>
            <View style={{ marginLeft: 16 }}>
              <Text style={{ marginTop: 16 }}>QR-Answers API Tester</Text>
              <Pressable style={{ width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5, marginTop: 10 }}
                onPress={() => {
                  fetchProjects();
                }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Get Projects</Text>
              </Pressable>
            </View>
            <View style={{ marginLeft: 16 }}>

              <Pressable style={{ width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5, marginTop: 10 }}
                onPress={() => {
                  createProject();
                }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Create Project</Text>
              </Pressable>
            </View>
            {projectId ?
              <View style={{ marginLeft: 16 }}>
                <Pressable style={{ width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5, marginTop: 10 }}
                  onPress={async () => {
                    updateProject(projectId);
                  }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Update Project</Text>
                </Pressable>
              </View>
              : null}
          </>
    }
      {fetchingProjects &&
        <ActivityIndicator size="large" color="#0000ff" />}
      {renderProjects()}
    </ScrollView>
    )
  }

  const resetCount = async () => {
    try {
      const res = await qranswers.api.resetNotificationAggregate("e53d706e-aadf-4916-a1f9-121218ec54b5", 'q', 'question');
      console.log(res);

    } catch (err) {
      console.log(err);
    }
  }
  const resetResponses = async () => {
    try {
      const res = await qranswers.api.resetQuestionAssignmentResponses('4a87e71d-c8cf-4749-829f-c2cce73c3d08_0f35351b-4f03-4a0e-ad4a-bcab04229dc2_d5b82c4b-0084-4c0f-b019-d69d3c3f3fb5_e53d706e-aadf-4916-a1f9-121218ec54b5');
      console.log(res);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    renderHierarchy()
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
