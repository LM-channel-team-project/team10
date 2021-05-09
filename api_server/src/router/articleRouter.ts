import express from 'express';
import RssFeedRepository from '../repository/ArticleRepository';
import { PaginateResult } from 'mongoose';
import Article, { ArticleModel } from '../model/Article';

const router = express.Router();
/**
 * @swagger
 *  components:
 *    schemas:
 *      Article:
 *        type: object
 *        properties:
 *          articleId:
 *            type: string
 *          articleUrl:
 *            type: string
 *          providerId:
 *            type: string
 *          providerName:
 *            type: string
 *          providerAvatar:
 *            type: string
 *          title:
 *            type: string
 *          thumbnail:
 *            type: string
 *          insertDate:
 *            type: string
 *            format: date
 *          keywords:
 *            type: array
 *            items:
 *              type: string
 */

/**
 * @swagger
 * /article:
 *  get:
 *    summary: RSS 아티클 최신순 페이지 요청
 *    tags:
 *      - article
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: query
 *        name: page
 *        description: page 번호
 *        schema:
 *          type: number
 *        required: true
 *    responses:
 *      200:
 *        description: 아티클 정상 반환
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Article'
 *                totalDocs:
 *                  type: number
 *                limit:
 *                  type: number
 *                totalPages:
 *                  type: number
 *                page:
 *                  type: number
 *                pagingCounter:
 *                  type: number
 *                hasPrevPage:
 *                  type: boolean
 *                hasNextPage:
 *                  type: boolean
 *                prevPage:
 *                  type: number
 *                  nullable: true
 *                nextPage:
 *                  type: number
 *                  nullable: true
 *      406:
 *        description: 데이터가 올바르지 않음
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/ResponseMessage'
 *
 *      500:
 *        description: 서버 에러 발생
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/ResponseMessage'
 */
router.get(
  '/',
  async (request: express.Request, response: express.Response) => {
    const page = request.query.page;
    if (!page)
      return response.status(406).json({
        message: 'page를 전달해주세요.',
      });

    try {
      const { code, data, message } = await RssFeedRepository.pagenateFeed(
        parseInt(page as string)
      );
      const { docs, ...extra } = data as PaginateResult<ArticleModel>;
      return response
        .status(code)
        .json({ message: message || '', data: docs, ...extra });
    } catch (e) {
      console.log(e);
      return response.status(500).json({ message: '에러가 발생했습니다.' });
    }
  }
);

export default router;
