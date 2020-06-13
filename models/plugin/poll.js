// Database
const query = require('../../core/database');

/*
 * Plugin Poll
 */
class Poll {
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
    return await query(
      `INSERT INTO tb_plugin_poll
           (circleId, question, createdBy, periodStartOn, periodEndOn) 
       VALUES 
           (?, ?, ?, ?, ?)`,
      [circleId, question, userId, startOn, endOn]
    )
      .then((result) => {
        // Check if has result
        if (result != null) {
          return parseInt(result.insertId);
        } else {
          return 0;
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
    return await query(
      `UPDATE tb_plugin_poll SET 
            question = ?
            , periodStartOn = ?
            , periodEndOn = ?
        WHERE
            id = ?
            AND circleId = ?
            AND removedOn IS NULL`,
      [question, startOn, endOn, id, circleId]
    )
      .then((result) => {
        // Check if has result
        return result != null && result.changedRows > 0;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Edit an existing question
   * @param id {int} Question Id
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return {bool} Success
   */
  async removePoll(id, circleId, userId) {
    return await query(
      `UPDATE tb_plugin_poll SET 
            removedBy = ?
            , removedOn = NOW()
        WHERE
            id = ?
            AND circleId = ?
            AND removedOn IS NULL`,
      [userId, id, circleId]
    )
      .then((result) => {
        // Check if has result
        return result != null && result.changedRows > 0;
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Get all active polls
   * @return {array} List of active Polls
   */
  async getActivePolls(circleId) {
    return await query(
      `SELECT
            DISTINCT
            PP.id
            , PP.question
            , PP.createdOn
            , CONCAT(U.firstName, ' ', U.lastName) AS createdBy
            , PP.periodStartOn
            , PP.periodEndOn
        FROM 
            tb_plugin_poll AS PP
            INNER JOIN tb_plugin_poll_answer AS PPA ON PP.id = PPA.pollId
            INNER JOIN tb_user AS U ON PP.createdBy = U.id
        WHERE
            PP.circleId = ?
            AND PP.removedOn IS NULL
            AND PPA.removedOn IS NULL
            AND PP.periodStartOn <= NOW()
            AND PP.periodEndOn >= NOW()`,
      [circleId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the all polls
          return result.map((poll) => {
            return { ...poll };
          });
        } else {
          return null;
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
    return await query(
      `SELECT
            DISTINCT
            PP.id
            , PP.question
            , PP.createdOn
            , CONCAT(U.firstName, ' ', U.lastName) AS createdBy
            , PP.periodStartOn
            , PP.periodEndOn
        FROM 
            tb_plugin_poll AS PP
            INNER JOIN tb_plugin_poll_answer AS PPA ON PP.id = PPA.pollId
            INNER JOIN tb_user AS U ON PP.createdBy = U.id
        WHERE
            PP.circleId = ?
            AND PP.removedOn IS NULL
            AND PPA.removedOn IS NULL
            AND PP.periodStartOn >= DATE_SUB(NOW(), INTERVAL 31 DAY)`,
      [circleId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the all polls
          return result.map((poll) => {
            return { ...poll };
          });
        } else {
          return null;
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
    return await query(
      `INSERT INTO tb_plugin_poll_answer
           (pollId, answer, createdBy) 
       VALUES 
           (?, ?, ?)`,
      [pollId, answer, userId]
    )
      .then((result) => {
        // Check if has result
        if (result != null) {
          return parseInt(result.insertId);
        } else {
          return 0;
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
    return await query(
      `UPDATE tb_plugin_poll_answer SET 
            answer = ?
        WHERE
            id = ?
            AND pollId = ?
            AND removedOn IS NULL`,
      [answer, id, pollId]
    )
      .then((result) => {
        // Check if has result
        return result != null && result.changedRows > 0;
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
    return await query(
      `UPDATE tb_plugin_poll_answer SET 
            removedOn = NOW()
            , removedBy = ?
        WHERE
            id = ?
            AND pollId = ?
            AND removedOn IS NULL`,
      [userId, id, pollId]
    )
      .then((result) => {
        // Check if has result
        return result != null && result.changedRows > 0;
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
    return await query(
      `SELECT 
            PPA.id
            , PPA.answer
            , PPA.totalVotes
        FROM 
            tb_plugin_poll_answer AS PPA
        WHERE
            PPA.pollId = ?
            AND PPA.removedOn IS NULL`,
      [pollId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the all polls
          return result.map((answer) => {
            return { ...answer };
          });
        } else {
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Update the Total of Votes of an Answer
   * @param answerId {int} Answer Id
   * @param userId {int} User Id
   * @return {int} Id of the new vote
   */
  async updateAnswerTotalVotes(answerId) {
    return await query(
      `UPDATE tb_plugin_poll_answer 
        SET totalVotes = (SELECT COUNT(*) FROM tb_plugin_poll_answer_vote AS PPAV WHERE PPAV.answerId = ?)
        WHERE id = ?`,
      [answerId, answerId]
    )
      .then((result) => {
        // Check if has result
        return result != null && result.changedRows > 0;
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
    return await query(
      `INSERT INTO tb_plugin_poll_answer_vote
           (answerId, createdBy) 
       VALUES 
           (?, ?)`,
      [answerId, userId]
    )
      .then((result) => {
        // Check if has result
        if (result != null) {
          return parseInt(result.insertId);
        } else {
          return 0;
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
    return await query(
      `SELECT 
            DISTINCT
            PPAV.answerId
            , PPAV.createdOn
            , CONCAT(U.firstName, ' ', U.lastName) AS createdBy
        FROM  
            tb_plugin_poll AS PP
            INNER JOIN tb_plugin_poll_answer AS PPA ON PP.id = PPA.pollId 
            INNER JOIN tb_plugin_poll_answer_vote AS PPAV ON PPA.id  = PPAV.answerId
            INNER JOIN tb_user AS U ON PPAV.createdBy = U.id
        WHERE 
            PP.id = ?
            AND PP.removedOn IS NULL
            AND PPA.removedOn IS NULL`,
      [pollId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the all polls
          return result.map((vote) => {
            return { ...vote };
          });
        } else {
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export
module.exports = Poll;
