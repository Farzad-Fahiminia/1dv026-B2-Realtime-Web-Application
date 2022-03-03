/**
 * Module for the SnippetsController.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

import fetch from 'node-fetch'

// "Faking" persistent products.
// const issues = [
//   { id: 1, name: 'storm kitchen' },
//   { id: 2, name: 'cell box' },
//   { id: 3, name: 'recycled garments' },
//   { id: 4, name: 'electric bike' },
//   { id: 5, name: 'VR glasses' }
// ]

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
      // console.log('************ INDEX *************')
      let data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.PRIVATE_TOKEN
        }
      })
      data = await data.json()

      // console.log(data)

      const viewData = data.map(issue => ({
        id: issue.iid,
        title: issue.title,
        description: issue.description,
        author: issue.author.name,
        avatar: issue.author.avatar_url,
        state: issue.state
      }))

      // console.log(viewData)

      // const viewData = { issues }
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
    console.log('HITTAR VI POST?')
    // console.log(req.body.issueStatus)

    const id = req.body.issueId
    let status = req.body.issueStatus

    if (status === 'closed') {
      status = 'reopen'
    } else {
      status = 'close'
    }

    let data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${id}?state_event=${status}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.PRIVATE_TOKEN
      }
    })
    data = await data.json()

    // const viewData = data.map(issue => ({
    //   id: issue.iid,
    //   state: issue.state
    // }))

    // console.log(data)

    // --------------------------------------------------------------------------
    // Socket.IO: Send the created task to all subscribers.
    //
    res.io.emit('issue/update', data)
    // --------------------------------------------------------------------------

    res.redirect('..')
  }
}
