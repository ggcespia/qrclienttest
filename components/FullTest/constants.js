'use strict';

let constants = {
	// Constants for name of hidden project, location, etc. for qr-vote, qr-contest
	C_QRVOTE_PROJECT_NAME: 'QR-vote',
	C_QRVOTE_LOCATION_NAME: 'QR-vote location',

	C_MAXIMUM_ANSWERS: 6,		// maximum number of answers per question

	// Image size
	C_MAX_IMAGE_SIZE: 3000000,

	// Answer types
	C_ANSTYPE_TEXT: 0,
	C_ANSTYPE_IMAGE: 1,
	C_ANSTYPE_BOTH: 2,

	// Dispositions
	C_DISPOSITION_DRAFT: 0,
	C_DISPOSITION_ACTIVE: 1,
	C_DISPOSITION_INACTIVE: 2,
	C_TITLE_MARGIN_LEFT: 16,
	C_TITLE_MARGIN_BOTTOM: 8,
	C_SECTION_MARGIN_TOP: 10,
	// Groups
	C_GROUP_PROJECT_READONLY: 'Project_ReadOnly_',
	C_GROUP_PROJECT_CRUD: 'Project_CRUD_',
	C_GROUP_PROJECT_TRIAL: 'Trial',
	C_GROUP_PROJECT_INVITE: 'Project_Invite_',
	C_GROUP_PROJECT_DEVELOP: 'Project_Develop_',
	C_GROUP_PROJECT_DEV_WRITE: 'PDev_W_',
	C_GROUP_PROJECT_CREATE: 'Project_Create',	// not used yet
	C_GROUP_PROJECT_READ: 'Project_Read',
	C_GROUP_PROJECT_UPDATE: 'Project_Update',
	C_GROUP_PROJECT_DELETE: 'Project_Delete',
	C_GROUP_SUBPROJECT_PREFIX: 'SubProject_',
	C_GROUP_SUBPROJECT_READONLY: 'SubProject_ReadOnly_',
	C_GROUP_SUBPROJECT_CRUD: 'SubProject_CRUD_',
	C_GROUP_SUBPROJECT_INVITE: 'SubProject_Invite_',
	C_GROUP_SUBPROJECT_DEVELOP: 'SubProject_Develop_',
	C_GROUP_SUBPROJECT_DEV_WRITE: 'SPDev_W_',
	C_GROUP_SUBPROJECT_CREATE: 'SubProject_Create_',	// not used yet
	C_GROUP_SUBPROJECT_UPDATE: 'SubProject_Update_',
	C_GROUP_SUBPROJECT_DELETE: 'SubProject_Delete_',
	// Billing
	C_XACTION_QUESTION: "QUEST",
	C_XACTION_ANSWER: "ANS",
	C_XACTION_ADDANSWER: "ADDANS",
	C_XACTION_ADDTIME: "ADDTIME",
	C_XACTION_EXTENSION: "EXT",
	C_XACTION_OVERAGE: "OV",
}

module.exports = constants;
