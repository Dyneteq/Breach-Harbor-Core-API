const MetadataFormatter = ({ attemptType, metadata }) => {
  const formatMetadata = (attemptType, metadata) => {
    if (attemptType === 'FAIL2BAN') {
      const action = metadata?.action;
      switch (action) {
        case 'ban':
          return <span className="text-danger">BLOCKED</span>;
        case 'found':
          return <span className="text-warning">ATTEMPT</span>;
        default:
          return <span>-</span>;
      }
    } else {
      return <span>{JSON.stringify(metadata)}</span>;
    }
  };

  const formattedMetadata = formatMetadata(attemptType, metadata);

  return <span>{formattedMetadata}</span>;
};

export default MetadataFormatter;
