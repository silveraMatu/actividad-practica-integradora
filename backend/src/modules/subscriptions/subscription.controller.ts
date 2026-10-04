import { Request, Response, NextFunction } from "express";
import { ISubscriptionService } from "./services/subscription.service.types.js";
import { CreateSubscriptionDTO } from "./dto/subscription.dto.js";
import { authUserPayload } from "../../common/types/express.js";

export class SubscriptionController{
  constructor(
    private readonly subscriptionService: ISubscriptionService
  )
  { }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId }: Pick<authUserPayload, "userId"> = req.user!
      const ticketId = req.params.ticketId?.toString()!
  
      const subscription: CreateSubscriptionDTO = {userId, ticketId}
      
      await this.subscriptionService.createSubscription(subscription)
      res.status(201).json({
        status: "OK",
        statusCode: 201,
        message: "Te has suscripto al ticket exitosamente"
      })
      
    } catch (err) {
      next(err)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId }: Pick<authUserPayload, "userId"> = req.user!
      const subscriptionId = req.params.id!.toString()

      await this.subscriptionService.deleteSubscription(userId, subscriptionId)
      res.status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Te has desuscripto del ticket"
      })
      
    } catch (err) {
      next(err)
    }
  }

  getAllSubscriptionsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId }: Pick<authUserPayload, "userId"> = req.user!
      const subscriptions = await this.subscriptionService.findSubscriptionsByUser(userId)
      res.status(200).json({
        status: "OK",
        statusCode: 200,
        data: subscriptions
      })
    } catch (err) {
      next(err)
    }
  }
}