// Model
const Todo = require('../../models/plugin/todo');

// Custom Exception
const BvitError = require('../../core/express/bvitError');

/*
 * Business Logic related to the Todo Plugin
 */
class TodoService {
  constructor() {
    this.TodoModel = new Todo();
  }

  /*
   * Get all todos
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @return {array} List of Todos
   */
  async getAll(circleId, userId) {
    return await this.TodoModel.getAll(circleId, userId)
      .then((todos) => {
        if (todos != null && todos.length > 0) {
          return todos;
        } else {
          throw new BvitError(404, 'There are no To-dos.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Add a new To-do
   * @param circleId {int} Circle Id
   * @param userId {int} User Id
   * @param description {string} Description of the to-do
   * @return {int} Id of the new Todo
   */
  async add(circleId, userId, description) {
    return await this.TodoModel.add(userId, circleId, description)
      .then((todoId) => {
        if (todoId > 0) {
          return todoId;
        } else {
          throw new BvitError(500, 'Internal Server Error');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  /*
   * Mark a Todo as Done
   * @param id {int} Todo Id
   * @param userId {int} User Id
   * @return {bool} Updated or Not
   */
  async markAsDone(id, userId) {
    return await this.TodoModel.markAsDone(id, userId)
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
   * Delete a Todo
   * @param id {int} Todo Id
   * @param userId {int} User Id
   * @return {bool} Updated or Not
   */
  async remove(id, userId) {
    return await this.TodoModel.remove(id, userId)
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
}

// Export the service class
module.exports = TodoService;
