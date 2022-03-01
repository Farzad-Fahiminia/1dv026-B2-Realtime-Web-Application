/**
 * Module for the SnippetsController.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

// "Faking" persistent products.
const issues = [
  { id: 1, name: 'storm kitchen' },
  { id: 2, name: 'cell box' },
  { id: 3, name: 'recycled garments' },
  { id: 4, name: 'electric bike' },
  { id: 5, name: 'VR glasses' }
]

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
      const viewData = { issues }
      res.render('issues/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async show (req, res, next) {
    // Get the first product that's id equals the parameter id's value.
    const issue = issues
      .filter(issue => issue.id === Number(req.params.id))
      .shift()

    // If no product is found send a 404 (resource not found).
    if (!issue) {
      const error = new Error('Not Found')
      error.status = 404

      // IMPORTANT! Never throw an exception in an async action handler,
      // always call next!
      next(error)
      return
    }

    // Send response with the wanted product.
    const viewData = { issue }
    res.render('products/show', { viewData })
  }

  /**
   * Returns a HTML form for creating a new product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createForm (req, res, next) {
    try {
      res.render('issues/create')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      // Make the product "persistent" and...
      issues.push({
        id: issues.length + 1,
        name: req.body.name
      })

      // ...redirect to the list of products.
      res.redirect('.')
    } catch (error) {
      next(error)
    }
  }

  async test (req, res, next) {
    console.log(req.body)
  }

  async test2 (req, res, next) {
    console.log(req.body)
  }
}
