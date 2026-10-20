export class UpdateArticleCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly text?: string,
  ) {}
}
