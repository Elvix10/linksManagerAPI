// @ts-nocheck
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Link from "App/Models/Link";
import puppeteer from "puppeteer";

export default class LinksController {
  public async index({}: HttpContextContract) {
    try {
      const links = await Link.all();
      console.log(links);

      return links;
    } catch (error) {
      console.log(error);
    }
  }

  public async store({ request }: HttpContextContract) {
    try {
      const link = await Link.create({
        url: request.input("url"),
        title: request.input("title"),
        description: request.input("description"),
      });
      await link.save();

      return { message: "link saved", data: link };
    } catch (error) {
      console.log(error);
    }
  }

  public async show({ params }: HttpContextContract) {
    try {
      const link = await Link.find(params.id);

      return link;
    } catch (error) {
      console.log(error);
    }
  }

  public async update({ params, request }: HttpContextContract) {
    try {
      const linkData = request.only(["url", "title", "description"]);
      const link = await Link.find(params.id);
      link?.merge(linkData);

      await link.save();
     

      return {
        message: "link updated",
        data: link,
      };
    } catch (error) {
      console.log(error);
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const link = await Link.find(params.id);
    await link?.delete();

    return {
      message: "link deleted",
      data: link,
    };
  }

  async crawler({}: HttpContextContract) {
    const browser = await puppeteer.launch({
      'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });
    const page = await browser.newPage();
    await page.goto("https://devgo.com.br/");

    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".blog-article-card"), (e) => ({
        title: e.querySelector("h1 a").innerText,
        link: e.querySelector("a").href,
      }))
    );

    await browser.close();
    return links;
  }
}
