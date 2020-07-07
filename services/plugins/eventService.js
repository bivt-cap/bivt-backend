/**
 * Business Logic related to the Event (Calendar) Plugin
 *
 * @version 0.0.1
 * @author Eduardo Pereira do Carmo (https://github.com/eduardopcarmo)
 */

// Model
const Event = require('../../models/plugin/event');

// Custom Exception
const BvitError = require('../../core/express/bvitError');

/*
 * Business Logic related to the Event Plugin
 */
class EventService {
  constructor() {
    this.EventModel = new Event();
  }

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
    return await this.EventModel.add(
      circleId,
      title,
      startOn,
      endOn,
      note,
      createdBy
    )
      .then((eventId) => {
        if (eventId > 0) {
          return eventId;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .then(async (eventId) => {
        await this.EventModel.addMember(eventId, createdBy, createdBy);
        return eventId;
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
    return await this.EventModel.update(eventId, title, startOn, endOn, note)
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
   * Remove an existent event
   * @param eventId {int} Event Id
   * @param removedBy {int} User Id
   * @return {bool} Status of execution
   */
  async remove(eventId, removedBy) {
    return await this.EventModel.remove(eventId, removedBy)
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
   * Get events between start and enddate
   * @param circleId {int} Circle Id
   * @param startOn {datetime} Event start date and time
   * @param endOn {datetime} Event end date and time
   * @return {array} Events
   */
  async getEvents(circleId, startOn, endOn) {
    return await this.EventModel.getEvents(circleId, startOn, endOn)
      .then((events) => {
        if (events != null && events.length > 0) {
          return events;
        } else {
          throw new BvitError(404, 'There are no Events.');
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
    return await this.EventModel.getMembers(eventId)
      .then((members) => {
        let canInsert = true;
        if (members != null && members.length > 0) {
          const mIndex = members.find((m) => m.id === userId);
          if (mIndex >= 0) {
            canInsert = false;
          }
        }
        return canInsert;
      })
      .then(async (canInsert) => {
        if (canInsert) {
          const id = await this.EventModel.addMember(
            eventId,
            userId,
            createdBy
          );
          return id;
        } else {
          throw new BvitError(400, 'User already member of the event');
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
    return await this.EventModel.getMembers(eventId)
      .then((members) => {
        if (members != null && members.length > 0) {
          return members;
        } else {
          throw new BvitError(404, 'There are no Members.');
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
    return await this.EventModel.removeMember(eventId, userId, removedBy)
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
   * Add a new Photo to an Event
   * @param eventId {int} Event Id
   * @param photoPath {string} Path of the Photo in our server
   * @param createdBy {int} User Id
   * @return {int} Id of the new member
   */
  async addPhoto(eventId, photoPath, createdBy) {
    return await this.EventModel.addPhoto(eventId, photoPath, createdBy)
      .then((photoId) => {
        if (photoId > 0) {
          return photoId;
        } else {
          throw new BvitError(500, 'Internal Server Error');
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
    return await this.EventModel.getPhotos(eventId)
      .then((photos) => {
        if (photos != null && photos.length > 0) {
          return photos;
        } else {
          throw new BvitError(404, 'There are no Photos.');
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
    return await this.EventModel.removePhoto(eventId, photoId, removedBy)
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
   * Get photo by Id
   * @param photoId {string} Photo Id
   * @param userId {int} User Id
   * @return {string} PhotoPath
   */
  async getPhotoPath(photoId, userId) {
    return await this.EventModel.getPhotoPath(photoId, userId)
      .then((photo) => {
        if (photo != null) {
          return photo;
        } else {
          throw new BvitError(404, 'Photo not founded.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}

// Export the service class
module.exports = EventService;
