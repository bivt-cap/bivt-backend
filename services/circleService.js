// Node.JS module
const path = require('path');

// Model
const Circle = require('../models/circle/circle');
const CircleMember = require('../models/circle/circleMember');

// Custom Exception
const BvitError = require('../core/express/bvitError');

// Send Email
const sendEmail = require('../core/sendEmail');

// Replace content from a file
const replaceContent = require('../core/replaceContent');

/*
 * Business Logic related to the User
 */
class CircleService {
  constructor() {
    this.CircleModel = new Circle();
    this.CircleMemberModel = new CircleMember();
  }

  /*
   * Create a new Circles
   * @param ownerId {int} User (Owner) Id
   * @param ownerEmail {string} User (owner) Email
   * @param name {string} Name of the new Circle
   * @return {int} id of the new Circle
   */
  async addNewCircle(ownerId, ownerEmail, name) {
    return await this.CircleModel.add(name, ownerId)
      .then((result) => {
        // The user was not created
        if (result === 0) {
          throw new BvitError(
            500,
            'An error occurred, please try again later.'
          );
        } else {
          return result;
        }
      })
      .then(async (circleId) => {
        await this.CircleMemberModel.add(
          circleId,
          ownerId,
          ownerId,
          ownerEmail
        );
        return circleId;
      })
      .catch(() => {
        throw new BvitError(500, 'An error occurred, please try again later.');
      });
  }

  /*
   * Return the list of all Circles that the user belongs (invited or owner)
   * @param userId {int} User Id
   * @return List of Circles
   */
  async getCirclesByUser(userId) {
    return await this.CircleModel.getCirclesByUser(userId)
      .then((result) => {
        if (result != null && result.length > 0) {
          return result;
        } else {
          throw new BvitError(404, 'There is no circle related to this user.');
        }
      })
      .catch(() => {
        throw new BvitError(500, 'An error occurred, please try again later.');
      });
  }

  /*
   * Get the number of Circles that the user is owner
   * @param userId {int} User Id
   * @return {int} Number of Circles that the user is owner
   */
  async getNumberCirclesByOwner(userId) {
    return await this.CircleModel.getNumberCirclesByOwner(userId)
      .then((result) => {
        return result;
      })
      .catch(() => {
        throw new BvitError(500, 'An error occurred, please try again later.');
      });
  }

  /*
   * Invite a user to join a circle
   * @param userId {int} User Id
   * @param userIdToInvite {int} User Id to Invite
   * @param userEmailToInvite {string} User Email to Invite
   * @param circleId {int} Circle Id
   * @param baseUrl {string} Base url of our application
   * @return {bool} Result of Invite
   */
  async AddUserToCircle(
    userId,
    userIdToInvite,
    userEmailToInvite,
    circleId,
    baseUrl
  ) {
    return await this.CircleModel.getCirclesByUser(userId)
      .then((circles) => {
        // Check if the user has a circle
        if (circles != null && circles.length > 0) {
          // Find in the list of Circles if the user is an admin of the received circle id.
          const circle = circles.find((c) => {
            return c.id === circleId && c.isAdmin === 1;
          });

          // Found it ?
          if (circle !== null) {
            return circle;
          } else {
            throw new BvitError(401, 'Unauthorized');
          }
        } else {
          throw new BvitError(404, 'There is no circle related to this user.');
        }
      })
      .then(async (circle) => {
        await this.CircleMemberModel.add(
          circle.id,
          userId,
          userIdToInvite,
          userEmailToInvite
        );
        return circle;
      })
      .then((circle) => {
        return this.SendInviteEmail(circle.name, userEmailToInvite, baseUrl);
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Send an email to invite a user to  join a circle
   * @param circleName {string} Name of the circle
   * @param emailTo {string} Send the email to
   * @param userId {int} User id that invited the email to join
   * @param baseUrl {string} Url base for our API
   * @return {bool} Result of Invite
   */
  async SendInviteEmail(circleName, emailTo, baseUrl) {
    // Load the template
    const emailTemplate = replaceContent(
      path.join(__dirname, '../public/email/inviteUserToJoinCircle.html'),
      {
        emailTo,
        baseUrl,
        circleName,
      }
    );

    // Send email to check if is a real email
    await sendEmail(
      emailTo,
      'A user is inviting you to join his/her circle',
      '',
      emailTemplate
    );

    return true;
  }

  /*
   * Set all Invited member with the same email to set the new user id
   * @param email {string} Email to use as a filter
   * @param userId {int} The user (id) to be set
   * @return void
   */
  async updateInviteWithUserIdByEmail(email, userId) {
    return await this.CircleModel.updateInviteWithUserIdByEmail(email, userId)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Confirm a User (member) of a Circle
   * @param userId {int} The user Id
   * @param circleId {int} Circle Id
   * @return void
   */
  async confirmMemberOfCircle(userId, circleId) {
    return await this.CircleModel.confirmMemberOfCircle(userId, circleId)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Remove a User (member) from a Circle
   * @param userId {int} The user Id
   * @param circleId {int} Circle Id
   * @return void
   */
  async removeMemberFromCircle(userId, circleId) {
    return await this.CircleModel.removeMemberFromCircle(userId, circleId)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = CircleService;
