/**
 * Module for the IssuesController.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class IssuesController {
  /**
   * Displays a list of products.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      let data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.PRIVATE_TOKEN
        }
      })
      data = await data.json()

      const viewData = data.map(issue => ({
        id: issue.iid,
        title: issue.title,
        description: issue.description,
        author: issue.author.name,
        avatar: issue.author.avatar_url,
        state: issue.state
      }))

      res.render('issues/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updatePost (req, res, next) {
    const id = req.body.issueId
    let status = req.body.issueStatus

    if (status === 'closed') {
      status = 'reopen'
    } else {
      status = 'close'
    }

    await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${id}?state_event=${status}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.PRIVATE_TOKEN
      }
    })

    res.redirect('..')
  }
}
