/**
 * Business Logic related to the Poll Plugin
 *
 * @version 0.0.1
 * @author Eduardo Pereira do Carmo (https://github.com/eduardopcarmo)
 */

// Model
const Poll = require('../../models/plugin/poll');

// Custom Exception
const BvitError = require('../../core/express/bvitError');

/*
 * Business Logic related to the Poll Plugin
 */
class PollService {
  constructor() {
    this.PollModel = new Poll();
  }

  /*
   * Add a new Poll
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @param question {string} Question
   * @param startOn {string} Start datetime (yyyy-MM-dd HH:MM:SS)
   * @param endOn {string} End datetime (yyyy-MM-dd HH:MM:SS)
   * @return {int} Id of the new Poll
   */
  async addPoll(circleId, userId, question, startOn, endOn) {
    return await this.PollModel.addPoll(
      circleId,
      userId,
      question,
      startOn,
      endOn
    )
      .then((pollId) => {
        if (pollId > 0) {
          return pollId;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Edit an existing question
   * @param id {int} Question Id
   * @param circleId {int} Circle Id
   * @param question {string} Question
   * @param startOn {string} Start datetime (yyyy-MM-dd HH:MM:SS)
   * @param endOn {string} End datetime (yyyy-MM-dd HH:MM:SS)
   * @return {int} Id of the new Poll
   */
  async editPoll(id, circleId, question, startOn, endOn) {
    return await this.PollModel.editPoll(id, circleId, question, startOn, endOn)
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Remove an existing question
   * @param id {int} Question Id
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return {bool} Success
   */
  async removePoll(id, circleId, userId) {
    return await this.PollModel.removePoll(id, circleId, userId)
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get all active polls
   * @param circleId {int} Circle Id
   * @return {array} List of active Polls
   */
  async getActivePolls(circleId) {
    return await this.PollModel.getActivePolls(circleId)
      .then((polls) => {
        if (polls != null && polls.length > 0) {
          return polls;
        } else {
          throw new BvitError(404, 'There are no Active Polls.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get all valid polls in the last month
   * @return {array} List of active Polls
   */
  async getAllValidPolls(circleId) {
    return await this.PollModel.getAllValidPolls(circleId)
      .then((polls) => {
        if (polls != null && polls.length > 0) {
          return polls;
        } else {
          throw new BvitError(404, 'There are no Valid Polls.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Add a new answer to a Poll
   * @param pollId {int} Pool Id
   * @param userId {int} User Id
   * @param answer {string} Answer
   * @return {int} Id of the new Answer
   */
  async addAnswer(pollId, userId, answer) {
    return await this.PollModel.addAnswer(pollId, userId, answer)
      .then((answerId) => {
        if (answerId > 0) {
          return answerId;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Edit an existing Answer
   * @param id {int} Answer ID
   * @param pollId {int} Pool Id
   * @param userId {int} User Id
   * @param answer {string} Answer
   * @return {int} Id of the new Answer
   */
  async editAnswer(id, pollId, answer) {
    return await this.PollModel.editAnswer(id, pollId, answer)
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Remove an existing Answer
   * @param id {int} Answer ID
   * @param pollId {int} Pool Id
   * @param userId {int} User Id
   * @param answer {string} Answer
   * @return {int} Id of the new Answer
   */
  async removeAnswer(id, pollId, userId) {
    return await this.PollModel.removeAnswer(id, pollId, userId)
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get all active answers
   * @return {array} List of active answers
   */
  async getActiveAnswers(pollId) {
    return await this.PollModel.getActiveAnswers(pollId)
      .then((answers) => {
        if (answers != null && answers.length > 0) {
          return answers;
        } else {
          throw new BvitError(404, 'There are no Active Answer for this Poll.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Add a new vote to an Answer
   * @param answerId {int} Answer Id
   * @param userId {int} User Id
   * @return {int} Id of the new vote
   */
  async addVote(answerId, userId) {
    return await this.PollModel.addVote(answerId, userId)
      .then((voteId) => {
        if (voteId > 0) {
          return voteId;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .then(async () => {
        return await this.PollModel.updateAnswerTotalVotes(answerId);
      })
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get all votes in a Poll
   * @return {array} List of active answers
   */
  async getVotes(pollId) {
    return await this.PollModel.getVotes(pollId)
      .then((answers) => {
        if (answers != null && answers.length > 0) {
          return answers;
        } else {
          throw new BvitError(404, 'There are no Votes for this Poll.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = PollService;
