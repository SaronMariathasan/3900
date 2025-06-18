import express, { Request, Response } from 'express';
import cors from 'cors';


// NOTE: you may modify these interfaces
interface Student {
  id: number;
  name: string;
}

interface GroupSummary {
  id: number;
  groupName: string;
  members: number[];
}

interface Group {
  id: number;
  groupName: string;
  members: Student[];
}

const app = express();
const port = 3902;

// data

// students
let students: Student[] = [
{
  id: 1,
  name: "Bethenny"
},
{
  id: 2,
  name: "Carole"
},
{
  id: 3, 
  name: "Ramona"
},
{
  id: 4, 
  name: "Luann"
},
{
  id: 5,
  name: "Sonja"
},
{
  id: 6,
  name: "Dorinda"
},
{
  id: 7,
  name: "Jill"
},
{
  id: 8,
  name: "tinsley"
}
];

//groups
let groups: GroupSummary[] = [
  {
  id: 1, 
  groupName: "TeamB",
  members: [1, 4, 5]
  },
{
  id: 2, 
  groupName: "TeamC",
  members: [2, 3, 6]
},
{
  id: 3,
  groupName: "TeamZ",
  members: [7,8]
}
];

let groupCounter = 4;

// helper functions
// function findGroup(id: number, currElement: GroupSummary, index: number, array: GroupSummary[]) {
//   if (currElement.id == id) {
//     return true;
//   } else {
//     return false;
//   }
// }

app.use(cors());
app.use(express.json());

/**
 * Route to get all groups
 * @route GET /api/groups
 * @returns {Array} - Array of group objects
 */
app.get('/api/groups', (req: Request, res: Response) => {
  // TODO: (sample response below)
  res.json(groups);
});

/**
 * Route to get all students
 * @route GET /api/students
 * @returns {Array} - Array of student objects
 */
app.get('/api/students', (req: Request, res: Response) => {
  // TODO: (sample response below)
  res.json(students);
});

/**
 * Route to add a new group
 * @route POST /api/groups
 * @param {string} req.body.groupName - The name of the group
 * @param {Array} req.body.members - Array of member names
 * @returns {Object} - The created group object
 */
app.post('/api/groups', (req: Request, res: Response) => {
  const name = req.body.groupName;
  // edge-case: groupName has been taken
  const targetGroup = groups.find((group) => group.groupName == name);
  if (typeof targetGroup === "undefined") {
    res.status(404).send("Another group already exists with the same name");
  } else {
    const newGroup: GroupSummary = { id: groupCounter, groupName: name, members: req.body.members };
    groups.push(newGroup);
    groupCounter++;
    res.json(newGroup);
  }

});

/**
 * Route to delete a group by ID
 * @route DELETE /api/groups/:id
 * @param {number} req.params.id - The ID of the group to delete
 * @returns {void} - Empty response with status code 204
 */
app.delete('/api/groups/:id', (req: Request, res: Response) => {
  const deletedGroup = req.params.id;
  groups.sort((a :GroupSummary, b: GroupSummary) => a.id - b.id);
  groups.splice(deletedGroup - 1, 1);

  res.sendStatus(204); // send back a 204 (do not modify this line)
});

/**
 * Route to get a group by ID (for fetching group members)
 * @route GET /api/groups/:id
 * @param {number} req.params.id - The ID of the group to retrieve
 * @returns {Object} - The group object with member details
 */
app.get('/api/groups/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const targetGroup = groups.find((group) => group.id == id);
  // if no group found with matching id
  if (typeof targetGroup === "undefined") {
    res.status(404).send("Group not found");    
  } else {
    let members: any = [];
    for (let member of targetGroup.members) {
      let currStudent = students.find((student => student.id == member));
      members.push(currStudent);
    }

    res.json({
      id: targetGroup?.id,
      groupName: targetGroup?.groupName,
      members: members,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
