import React from 'react';

const ApiDocModelLink = ({refSchema}) => {
    if (!refSchema) {
        return null;
    }

    const schema = refSchema.schema;

    if (schema.type === 'array' && schema.items && schema.items.$ref) {
        return (
            <a href={`/{{page.modelsPath}}/${encodeURI(schema.items.$ref.split('/').pop())}`}>
                {`Array[${schema.items.$ref.split('/').pop()}]`}
            </a>
        );
    } else if (schema.$ref) {
        return (
            <a href={`/{{page.modelsPath}}/${encodeURI(schema.$ref.split('/').pop())}`}>
                {schema.$ref.split('/').pop()}
            </a>
        );
    }

    return null;
};

ApiDocModelLink.propTypes = {
    refSchema: React.PropTypes.object
};

ApiDocModelLink.displayName = 'Link to Model Documentation';

export default ApiDocModelLink;
