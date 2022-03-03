/**
 * Module for the WebhooksController.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class WebhooksController {
  /**
   * Authenticates the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticate (req, res, next) {
    // Use the GitLab secret token to validate the received payload.
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
      const error = new Error('Invalid token')
      error.status = 401
      next(error)
      return
    }

    next()
  }

  /**
   * Receives a webhook, and creates a new task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async indexPost (req, res, next) {
    try {
      // Only interested in issues events. (But still, respond with a 200
      // for events not supported.)
      if (req.body.event_type === 'issue') {
        const issue = {
          iid: req.body.object_attributes.iid,
          title: req.body.object_attributes.title,
          description: req.body.object_attributes.description,
          author: req.body.user.name,
          avatar: req.body.user.avatar_url,
          state: req.body.object_attributes.state
        }
        // console.log(issue)

        // It is important to respond quickly!
        res.status(200).end()

        // Put this last because socket communication can take long time.
        res.io.emit('issue/update', issue)
      }
    } catch (error) {
      const err = new Error('Internal Server Error')
      err.status = 500
      next(err)
    }
  }
}
