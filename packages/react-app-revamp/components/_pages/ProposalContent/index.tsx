interface ProposalContentProps {
  isImage: boolean;
  content: string;
  author: string;
}

export const ProposalContent = (props: ProposalContentProps) => {
  const { isImage, content, author } = props;
  return (
    <>
      <blockquote className="leading-relaxed">
        {isImage ? <img className="w-full max-w-72 2xs:max-w-96 h-auto" src={content} alt="" /> : <p>{content}</p>}
      </blockquote>
      <figcaption className="pt-4 font-mono overflow-hidden text-ellipsis">—{author}</figcaption>
    </>
  );
};

export default ProposalContent;
