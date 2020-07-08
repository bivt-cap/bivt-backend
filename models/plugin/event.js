/**
 * Data Access Layer related to the Event Plugin
 *
 * @version 0.0.1
 * @author Eduardo Pereira do Carmo (https://github.com/eduardopcarmo)
 */

// Database
const query = require('../../core/database');

/*
 * Event
 */
class Event {
  /*
   * Add a new Event
   * @param circleId {int} Circle Id
   * @param title {string} Event Title
   * @param startOn {datetime} Event start date and time
   * @param endOn {datetime} Event end date and time
   * @param note {string} Notes about the event
   * @param createdBy {int} User Id
   * @return {int} Id of the new event
   */
  async add(circleId, title, startOn, endOn, note, createdBy) {
    return await query(
      `INSERT INTO tb_plugin_event
          (circleId, title, note, startOn, endOn, createdBy) 
        VALUES 
          (?, ?, ?, ?, ?, ?)`,
      [circleId, title, note, startOn, endOn, createdBy]
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
   * Update an existent event
   * @param eventId {int} Event Id
   * @param title {string} Event Title
   * @param startOn {datetime} Event start date and time
   * @param endOn {datetime} Event end date and time
   * @param note {string} Notes about the event
   * @return {bool} Status of execution
   */
  async update(eventId, title, startOn, endOn, note) {
    return await query(
      `UPDATE tb_plugin_event SET 
          title = ?
          , note = ?
          , startOn = ?
          , endOn = ?
      WHERE 	
        id = ?
        AND removedOn IS NULL`,
      [title, note, startOn, endOn, eventId]
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
   * Remove an existent event
   * @param eventId {int} Event Id
   * @param removedBy {int} User Id
   * @return {bool} Status of execution
   */
  async remove(eventId, removedBy) {
    return await query(
      `UPDATE tb_plugin_event SET 
        removedBy = ?
        , removedOn = NOW()
      WHERE 	
        id = ?
        AND removedOn IS NULL`,
      [removedBy, eventId]
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
   * Get events between start and enddate
   * @param circleId {int} Circle Id
   * @param startOn {datetime} Event start date and time
   * @param endOn {datetime} Event end date and time
   * @return {array} Events
   */
  async getEvents(circleId, startOn, endOn) {
    return await query(
      `SELECT 
          PE.id
          , PE.title
          , PE.note 
          , PE.startOn
          , PE.endOn 
        FROM 
          tb_plugin_event AS PE
        WHERE
          PE.removedOn IS NULL
          AND PE.circleId = ?
          AND CAST(PE.startOn AS DATE) >= CAST( ? AS DATE)
          AND CAST(PE.endOn AS DATE) <= CAST(? AS DATE)`,
      [circleId, startOn, endOn]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found todos
          return result.map((event) => {
            return { ...event };
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
   * Add a new Member to an Event
   * @param eventId {int} Event Id
   * @param userId {int} User Id
   * @param createdBy {int} User Id
   * @return {int} Id of the new member
   */
  async addMember(eventId, userId, createdBy) {
    return await query(
      `INSERT INTO tb_plugin_event_member
          (eventId, userId, createdBy) 
        VALUES 
              (?, ?, ?)`,
      [eventId, userId, createdBy]
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
   * Get all member in an event
   * @param eventId {int} Event Id
   * @return {array} Members
   */
  async getMembers(eventId) {
    return await query(
      `SELECT 
          U.id,
          CONCAT(U.firstName, ' ', U.lastName) AS name,
          U.photoUrl
      FROM 
          tb_plugin_event_member AS PEM
          INNER JOIN tb_user AS U ON PEM.userId = U.id
      WHERE
          PEM.eventId = ?
          AND PEM.removedOn IS NULL
          AND U.emailValidatedOn IS NOT NULL`,
      [eventId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found todos
          return result.map((member) => {
            return { ...member };
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
   * Remove a new Member from an Event
   * @param eventId {int} Event Id
   * @param userId {int} User Id
   * @return {bool} Status of execution
   */
  async removeMember(eventId, userId, removedBy) {
    return await query(
      `UPDATE 
          tb_plugin_event_member
        SET 
          removedOn= NOW()
          , removedBy = ? 
        WHERE 
          eventId = ?
          AND userId = ?
          AND removedOn IS NULL`,
      [removedBy, eventId, userId]
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
   * Add a new Photo to an Event
   * @param eventId {int} Event Id
   * @param photoPath {string} Path of the Photo in our server
   * @param createdBy {int} User Id
   * @return {int} Id of the new member
   */
  async addPhoto(eventId, photoPath, createdBy) {
    return await query(
      `INSERT INTO tb_plugin_event_photo
          (eventId, photoPath, createdBy) 
        VALUES 
          (?, ?, ?)`,
      [eventId, photoPath, createdBy]
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
   * Get photos related to the event
   * @param eventId {int} Event Id
   * @return {array} Photos
   */
  async getPhotos(eventId) {
    return await query(
      `SELECT 
        photoId
        , photoPath AS photoUrl
      FROM 
        tb_plugin_event_photo 
      WHERE 
        eventId = ?
        AND removedOn IS NULL`,
      [eventId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found todos
          return result.map((photo) => {
            return { ...photo };
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
   * Remove a Phto from an event
   * @param eventId {int} Event Id
   * @param photoId {string} Photo Id
   * @return {bool} Status of execution
   */
  async removePhoto(eventId, photoId, removedBy) {
    return await query(
      `UPDATE tb_plugin_event_photo SET 
          removedOn = NOW()
          , removedBy = ?
        WHERE
          eventId = ?
          AND photoPath = ?
          AND removedOn IS NULL`,
      [removedBy, eventId, photoId]
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
   * Get photo by Id
   * @param photoId {string} Photo Id
   * @param userId {int} User Id
   * @return {string} PhotoPath
   */
  async getPhotoPath(photoId, userId) {
    return await query(
      `SELECT 
          PEP.photoPath
        FROM 
          tb_plugin_event_photo AS PEP
            INNER JOIN tb_plugin_event AS PE ON PEP.eventId = PE.id
            INNER JOIN tb_circle AS C ON PE.circleId = C.id
            INNER JOIN tb_circle_member AS CC ON C.id = CC.circleId
        WHERE
          PEP.photoId = ?
          AND CC.userId = ?
          AND C.inactivatedOn IS NULL
          AND CC.joinedOn IS NOT NULL
          AND CC.leftOn IS NULL`,
      [photoId, userId]
    )
      .then((result) => {
        // Check if has result
        if (result != null && result.length > 0) {
          // Return the found todos
          return result.map((photo) => {
            return { ...photo };
          });
        } else {
          return null;
        }
      })
      .then((result) => {
        if (result) {
          return result[0].photoPath;
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
module.exports = Event;
