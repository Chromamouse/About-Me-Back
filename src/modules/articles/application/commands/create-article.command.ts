export class CreateArticleCommand {
  constructor(
    public readonly title: string,
    public readonly text: string,
  ) {}
}
