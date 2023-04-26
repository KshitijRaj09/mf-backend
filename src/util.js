const checkIsUserFollowerHelper = async (inputModel, req) => {
   let allusers = await inputModel.find({});

   allusers = allusers
      .map((user) => ({
         userId: user._id.toString(),
         avatar: user.avatar,
         username: user.username,
         userDescription: user.description,
      }))
      .filter((user) => req.userid !== user.userId);

   let {followings: currentUserFollowings} = await inputModel
      .findById(req.userid)
      .select({
         followings: 1,
         _id: 0,
      });

   currentUserFollowings = currentUserFollowings.map((user) => user.toString());

   return {allusers, currentUserFollowings: new Set(currentUserFollowings)};
};

module.exports = {checkIsUserFollowerHelper};
