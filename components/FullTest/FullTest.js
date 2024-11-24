import {useEffect, useState} from 'react';
import {Pressable, ActivityIndicator, View} from 'react-native';
import {Text,withTheme } from 'react-native-paper';
import {
	C_ANSTYPE_BOTH,
	C_ANSTYPE_IMAGE,
	C_ANSTYPE_TEXT,
	C_DISPOSITION_ACTIVE,
	C_DISPOSITION_DRAFT,
	C_DISPOSITION_INACTIVE

} from './constants';

//
const FullTest = ({qranswers}) => {
	const [projectId, setProjectId] = useState(null);
	const [flagApiExercise, setFlagApiExercise] = useState(false);
	const [flagCreatingProject, setFlagCreatingProject] = useState(false);
	const [errorText, setErrorText] = useState('');
	const [testDone, setTestDone] = useState(false);

	const defaultProjectParams = {
		name: 'QR-Answers API Tester',
		abbreviation: 'QAT',
		tags: [{name: 'test'}, {name: 'api'}],
		description: 'This project was created by the QR-Answers API Tester'		
	}

	const updatedProjectParams = {
			name: 'API Updated Project',
			description: 'This project was updated by the QR-Answers API Tester',
			abbreviation: 'AUP',
	}
	const location1 = {
		name: 'Location 1',
		description: 'This is location 1',
		tags: [{name: 'test'}, {name: 'api'}],
	}
	const location2 = {
		name: 'Location 2',
		description: 'This is location 2',
		tags: [{name: 'test'}, {name: 'api'}],
	}
	const question1 = {
		text: 'How does question 1 work?',
		description: 'This is question 1',
		tags: [{name: 'question'}, {name: 'api'}],
	}
	const answersQ1 = [
		{
			text: 'Answer 1 to question 1',
			description: 'This is answer 1 to question 1',
			tags: [{ name: 'answer' }, { name: 'api' }],
			imageUrl: "",
			ansType: C_ANSTYPE_TEXT,
			//link: 'link',
			//linkDescription: 'linkDescription',
			//linkAction: 'embed',
			//additionalInfo: {},
		},
		{
			text: 'Answer 2 to question 2',
			description: 'This is answer 2 to question 2',
			tags: [{ name: 'answer' }, { name: 'api' }],
			imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hausziege_04.jpg/440px-Hausziege_04.jpg",
			ansType: C_ANSTYPE_BOTH,
			link: 'https://en.wikipedia.org/wiki/Goat',
			linkDescription: 'Wikipedia link',
			linkAction: 'embed',
			//additionalInfo: {},
		}
	];

	const question2 = {
		text: 'How does question 2 work?',
		description: 'This is question 2',
		tags: [{name: 'question'}, {name: 'api'}],
	}

	const campaign1 = {
		name: 'Campaign 1',
		abbreviation: 'C1',
		disposition: C_DISPOSITION_INACTIVE,
		description: 'This is campaign 1',
		tags: [{name: 'campaign'}, {name: 'api'}],
		automatic: false,
		startDate: '2024-11-07',
		endDate: '2024-12-07',
		settings: {
			qr: {
				foreground: '#000000',
				background: '#cccccc',
				textLayout: {
					name: 'default',
				},
				shape: 'star',
				imageLayout: {  // puts image qr code at top left
					name: "bottomleft",        // centerright, topright, bottomleft, centerleft, bottomright
					objectFit: 'cover',
					opacity: 0.5,
				}
			},
			logoUrl: '',
			hdr: {
				text: 'Scan it and go baby!',
			},
			chart: {
				name: 'Pie'		// None, HBar, Bar, Pie, Gradient Box
			}
		}
	}

	const bulkObject1 =
		[
			{
				text: "What flower do you like?",
				tags: [{ name: 'foo' }, { name: 'bar' }],
				description: "This is a question",
				answers: [
					{
						text: 'Bouganvillea',
						tags: [{ name: 'foo' }, { name: 'bar' }],
						description: 'This is an answer',
						link: 'https://www.google.com',
						linkDescription: 'Google',
						linkAction: 'embed',
						imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/640px-Walking_tiger_female.jpg',
					},
					{
						text: 'Cala Lily',
						tags: [{ name: 'foo' }, { name: 'bar' }],
						description: 'This is an answer2',
						imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBL1k_Ex-4nD3XSg7doLGkBb-Xa4YA9lul_w&s',
					}
				]
			},
			{
				text: "Question # 2?",
				tags: [{ name: 'two' }, { name: 'bar' }],
				description: "This is a question 2",
				answers: [
					{
						text: 'Answer 1',
						tags: [{ name: 'foo' }, { name: 'bar' }],
						description: 'This is an answer 1',
						link: 'https://www.google.com',
						linkDescription: 'Google',
						linkAction: 'embed',
						imageUrl: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
					},
					{
						text: 'Answer 2',
						tags: [{ name: 'two' }, { name: 'bar' }],
						description: 'This is an answer 2',
						link: 'https://www.google.com/2',
						linkDescription: 'Google 2',
						linkAction: 'embed',
					}
				]
			}
		]

	const bulkString1 = "How are you feeling?\n\tOK\n\tGood\n\tBad";

	useEffect(() => {
	}, []);

	// Upate name to "API Updated Project"
	const updateProject = async (pid) => {
		let res = { error: 'none' };

		try {
			res = await qranswers.api.updateProject(pid, updatedProjectParams);
		} catch (err) {
			console.log(err);
			res = { error: err.toString() };
		}
		return res;
	}


	const createProject = async () => {
		let res = { error: 'none' };

		setFlagCreatingProject(true);
		try {
			res = await qranswers.api.createProject(defaultProjectParams);

		} catch (err) {
			console.log(err);
			res = { error: err };
		}
		setFlagCreatingProject(false);

		return res;
	}

	const showError = (err) => {
		setErrorText(errorText + '\n' + err);
	}
	const clearError = () => {
		setErrorText('');
	}

	/*
		{
			id: projectId, 
			abbreviation: 'QAT', 
			description: 'This project was created by the QR-Answers API Tester', 
			name: 'API Updated Project', 
			tags: '|test|api|',
		}
	*/
	const validateProjectData = (projectData, projectId) => {
		let err = false;
		if (projectData.id != projectId) {
			setErrorText('Project ID not returned');
			err = true;
		}
		if (projectData.name != updatedProjectParams.name) {
			setErrorText('Project name not updated');
			err = true;
		}
		if (projectData.description != updatedProjectParams.description) {
			setErrorText('Project description not updated');
			err = true;
		}
		if (projectData.tags != '|test|api|') {
			setErrorText('Project tags not updated');
			err = true;
		}
		return err;
	}

	const showTimings = (timings) => {
		console.log('Timings', timings);
	}

	const fullAPIDemo = async () => {


    setFlagApiExercise(true);
		setTestDone(false);

    let hasError = false;
		let projectId = null;
		let timings = {};
    try {
			//--------------------------
			let start = new Date().getTime();
      const cStatus = await createProject();
      if (cStatus.error) {
        showError(cStatus.error);
        return;
      }
			let end = new Date().getTime();
			timings.createProject = end - start;
			//--------------------------


      projectId = cStatus.data.id;
      setProjectId(projectId);

			//--------------------------
			start = new Date().getTime();
      const uStatus = await updateProject(projectId);
      if (uStatus.error) {
        showError(uStatus.error);
        await qranswers.api.deleteProject(projectId);
        return;
      }
			end = new Date().getTime();
			timings.updateProject = end - start;
			//--------------------------


			//--------------------------
			start = new Date().getTime();
      const updData = await qranswers.api.getProject(projectId);
      if (updData.error) {
        showError(updData.error);
        await qranswers.api.deleteProject(projectId);
        return;
      }
			end = new Date().getTime();
			timings.getProject = end - start;
			//--------------------------


      //hasError = validateProjectData(updData.data[0], projectId);
			console.log('project', updData.data[0]);

			// Now, create a Location, Question+Answers and Campaign
			//--------------------------
			start = new Date().getTime();
			const loc1 = await qranswers.api.createLocation(projectId, location1);
			if (loc1.error) {
				showError(loc1.error);
        await qranswers.api.deleteProject(projectId);
        return;
      }
			end = new Date().getTime();
			timings.createLocation = end - start;
			//--------------------------


			console.log('loc1', loc1);
			//--------------------------
			start = new Date().getTime();
			const loc2 = await qranswers.api.createLocation(projectId, location2);
			if (loc2.error) {
				showError(loc2.error);
				await qranswers.api.deleteProject(projectId);
				return;
			}
			end = new Date().getTime();
			timings.createLocation2 = end - start;
			//--------------------------

			console.log('loc2', loc2);

			//--------------------------
			start = new Date().getTime();
			const q1 = await qranswers.api.createQuestion(projectId, question1);
			if (q1.error) {
				showError(q1.error);
				await qranswers.api.deleteProject(projectId);
				return;
			}
			end = new Date().getTime();
			timings.createQuestion1 = end - start;
			//--------------------------

			//--------------------------
			start = new Date().getTime();
			const q2 = await qranswers.api.createQuestion(projectId, question2);
			if (q2.error) {
				showError(q2.error);
				await qranswers.api.deleteProject(projectId);
				return;
			}
			end = new Date().getTime();
			timings.createQuestion2 = end - start;
			//--------------------------

			//--------------------------
			start = new Date().getTime();
			const a1 = await qranswers.api.createAnswer(q1.data.id, projectId, answersQ1[0]);
			if (a1.error) {
				showError(a1.error);
				await qranswers.api.deleteProject(projectId);
				return;
			}
			end = new Date().getTime();
			timings.createAnswer1 = end - start;
			//--------------------------

			//--------------------------
			start = new Date().getTime();
			const a2 = await qranswers.api.createAnswer(q1.data.id, projectId, answersQ1[1]);
			if (a2.error) {
				showError(a2.error);
				await qranswers.api.deleteProject(projectId);
				return;
			}
			end = new Date().getTime();
			timings.createAnswer2 = end - start;
			//--------------------------

			//--------------------------
			start = new Date().getTime();
			const camp1 = await qranswers.api.createCampaign(projectId, campaign1);
			if (camp1.error) {
				showError(camp1.error);
				await qranswers.api.deleteProject(projectId);
				return;
			}
			end = new Date().getTime();
			timings.createCampaign1 = end - start;
			//--------------------------

			console.log('camp1', camp1);

			//--------------------------
			start = new Date().getTime();
			const bulk1 = await qranswers.api.createBulkQAFromObject(projectId, bulkObject1);
			if (bulk1.error) {
				showError(bulk1.error);
				await qranswers.api.deleteProject(projectId);
				return;
			}
			end = new Date().getTime();
			timings.createBulk1 = end - start;
			//--------------------------

			console.log('bulk1', bulk1);

			//--------------------------
			start = new Date().getTime();
			const assign1 = await qranswers.api.assignQuestionsToLocation(loc1.data.id, camp1.data.id, [bulk1.data[0].id, bulk1.data[1].id]);
			if (assign1.error) {
				showError(assign1.error);
				await qranswers.api.deleteProject(projectId);
				return;
			}
			end = new Date().getTime();
			timings.assign1 = end - start;
			//--------------------------
			console.log('assign1', assign1);


			//--------------------------
			// List all QuestionLocations by CampaignId
			start = new Date().getTime();
			const campLocs = await qranswers.api.getQuestionsAtLocationList(camp1.data.id);
			if (campLocs.error) {
				showError(campLocs.error);
				await qranswers.api.deleteProject(projectId);
				return;
			}
			end = new Date().getTime();
			timings.campLocs = end - start;
			//--------------------------
			console.log('campLocs', campLocs);

			const pdfs = await qranswers.api.generatePDFsForLocations(
				camp1.data.id, 
				projectId, 
				[{locationId: loc1.data.id}], 
				{
					orientation: 'landscape',
					objectFit: 'contain',
					opacity: 1.0,
					showLocationName: false,
					decoration: {id:'plain_circle'},	// lineWidth=.5, border: 0
				}
			);
			console.log('pdfslink', pdfs.pdfResults.url);

			showTimings(timings);

			showError('API Exercise completed');

    } catch (err) {
      console.log(err);
    }
    finally {
			setTestDone(true);
			setFlagApiExercise(false);
		}
	}


	return (
		<>
			<View style={{ marginLeft: 16 }}>
				<Pressable style={{ width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5, marginTop: 10 }}
					disabled={flagApiExercise}
					onPress={() => {
						fullAPIDemo();
					}}>
					<Text style={{ color: 'white', fontWeight: 'bold' }}>API Exercise</Text>
				</Pressable>
			</View>
			{testDone && projectId ?
				<View style={{ marginLeft: 16 }}>
					<Pressable style={{ width: 200, padding: 10, backgroundColor: '#F000B4', borderRadius: 5, marginTop: 10 }}
						disabled={!testDone}
						onPress={async () => {
							await qranswers.api.deleteProject(projectId);
							setTestDone(false);
						}}>
						<Text style={{ color: 'white', fontWeight: 'bold' }}>Remove API Project</Text>
					</Pressable>
				</View>
				: null}
			{flagApiExercise ?
				<ActivityIndicator size="large" color="#0000ff" />
				: null}
			{errorText && errorText.length > 0 ? <Text style={{ color: 'red' }}>{errorText}</Text> : null}

		</>

	);
}

export default withTheme(FullTest);