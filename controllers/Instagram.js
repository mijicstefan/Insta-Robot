const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const igApiClient = require("instagram-private-api").IgApiClient;

// @desc      Login to Instagram
// @route     GET /api/v1/instagram/login
// @access    Private, only authenticated users.
exports.loginToInstagram = asyncHandler(async (req, res, next) => {
  const ig = new igApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  await ig.simulate.preLoginFlow();
  const loggedInAccount = await ig.account.login(
    process.env.IG_USERNAME,
    process.env.IG_PASSWORD
  );
  await ig.simulate.postLoginFlow();

  //LoggedInAccount data
  const fullName = loggedInAccount.full_name;
  const userName = loggedInAccount.username;

  const targetedUserID = await ig.user.getIdByUsername(req.body.username);
  console.log(`TargetedUsername id is ${targetedUserID}`);
  const friendshipData = await ig.friendship.show(targetedUserID);

  // Checking for the follow request, if true, accept it.
  let followingMessage;
  let approveMessage;
  if (friendshipData.incoming_request === true) {
    followingMessage = "You have a follow request.";

    //Approving the request.
    await ig.friendship.approve(targetedUserID);
    approveMessage = 'Your follow request has been accepted.';
    
  } else {
    followingMessage = `${userName} hasn't received a follow request from ${req.body.username} `;
    approveMessage = "It seems like there is no following request from you, or it already has been accepted.";
  }

  await ig.account.logout();

  res
    .status(200)
    .json({ success: true, data: friendshipData, followingMessage, approveMessage });
});
