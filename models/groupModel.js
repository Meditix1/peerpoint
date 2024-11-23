const { query } = require('../database');
const pool = require('../database.js')
const bcrypt = require('bcrypt');
const { configDotenv } = require('dotenv');
const jwt = require('jsonwebtoken');

// ------------------------- Functions ------------------------------///

// Creates a new account
module.exports.createGroup = async function createGroup(grpName, grpDesc, invitedMembers, token) {
    const decoded = jwt.decode(token);
    const createdBy = decoded.user.id;
    var createdAt = new Date();
    console.log(createdAt);
    // TODO: do smth with invitedMembers

    const sql = `INSERT INTO groups (group_name, description, created_by, is_active) 
        VALUES ('${grpName}', '${grpDesc}', ${createdBy}, true)
        RETURNING id`;

    var info = await query(sql);
    var newGroupId = info.rows[0].id;

    const createOwnerMemberSql = `INSERT INTO group_members (group_id, user_id, group_role)
        VALUES ('${newGroupId}', '${createdBy}', 'Owner')`;
    await query(createOwnerMemberSql);

    return "Success";
}

module.exports.getUserViewableGroups = async function getUserViewableGroups(token) {
    const decoded = jwt.decode(token);
    const requestingUserId = decoded.user.id;

    // Get those groups that the user created OR are in the group
    const sqlGroups = `SELECT g.*
        FROM groups g
        LEFT JOIN group_members gm ON g.id = gm.group_id
        WHERE g.created_by = $1 OR gm.user_id = $1
        GROUP BY g.id;`;

    const groups = await query(sqlGroups, [requestingUserId]);
    const groupRows = groups.rows;

    var createdByIds = groupRows.map(a => a.created_by).filter((a, index, self) => self.indexOf(a) === index);
    createdByIds = "(" + createdByIds.join(",") + ")";

    const sqlGetCreatedByNames = `SELECT user_id, username FROM users WHERE user_id IN ${createdByIds}`;
    const createdByNames = await query(sqlGetCreatedByNames);
    const createdByNamesRows = createdByNames.rows;

    var toReturn = [];
    for (var i = 0; i < groupRows.length; i++) {
        let group = groupRows[i];
        let createdBy = createdByNamesRows.find(a => a.user_id == group.created_by).username;

        toReturn.push({
            "id": group.id,
            "group_name": group.group_name,
            "created_by": createdBy,
            "created_at": group.created_at,
            "description": group.description
        });
    }

    //console.log(toReturn);

    return toReturn;
}

module.exports.getGroupDetails = async function getGroupDetails(group_id) {
    const sqlGroups = `SELECT * FROM groups WHERE id = $1`;
    const groups = await query(sqlGroups, [group_id]);
    const groupRows = groups.rows[0];

    const sqlGetGroupMembers = `SELECT * FROM group_members WHERE group_id = $1`
    const groupMembers = await query(sqlGetGroupMembers, [groupRows.id]);
    const groupMembersRows = groupMembers.rows;

    var grpMemberIds = groupMembersRows.map(a => a.user_id).filter((a, index, self) => self.indexOf(a) === index);
    grpMemberIds = "(" + grpMemberIds.join(",") + ")";

    const sqlGetGrpMemberInfo = `SELECT user_id, username FROM users WHERE user_id IN ${grpMemberIds}`;
    const members = await query(sqlGetGrpMemberInfo);
    const membersRows = members.rows;

    var groupMembersCompleteInfo = [];

    for (var m in groupMembersRows) {
        var memberInfo = groupMembersRows[m]
        var memberUserInfo = membersRows.find(a => a.user_id == memberInfo.user_id);
        let info = {
            "user_id": memberUserInfo.user_id,
            "username": memberUserInfo.username,
            "joined_at": memberInfo.joined_at,
            "group_role": memberInfo.group_role
        }

        groupMembersCompleteInfo.push(info);
    }

    var toReturn = {
        "id": groupRows.id,
        "group_name": groupRows.group_name,
        "created_by": groupRows.createdBy,
        "created_at": groupRows.created_at,
        "description": groupRows.description,
        "group_members": groupMembersCompleteInfo
    };

    return toReturn;
}