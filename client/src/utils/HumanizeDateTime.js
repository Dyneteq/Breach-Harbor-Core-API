const HumanizeDateTime = ({ dateTime }) => {
  const formatDateTime = (dateTime) => {
    if (!dateTime){
      return '-';
    }
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return new Date(dateTime).toLocaleString(undefined, options);
  };

  return formatDateTime(dateTime);
};

export default HumanizeDateTime;
