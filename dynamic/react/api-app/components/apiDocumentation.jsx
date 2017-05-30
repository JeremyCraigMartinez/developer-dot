import React from 'react';
import url from 'url';
import ReactMarkdown from 'react-markdown';

const ApiDocumentation = ({endpoint}) => (
    <div>
        <h1>{endpoint.operationId}</h1>
        <table className='styled-table'>
            <thead>
                <tr>
                    <th>{'API'}</th>
                    <td>{endpoint.operationId}</td>
                </tr>
                <tr>
                    <th>{'Purpose'}</th>
                    <td>{endpoint.name}</td>
                </tr>
                <tr>
                    <th>{'HTTP Verb'}</th>
                    <td>{endpoint.action.toUpperCase()}</td>
                </tr>
                <tr>
                    <th>{'REST Path'}</th>
                    <td>{decodeURI(url.parse(endpoint.path).pathname)}</td>
                </tr>
                <tr>
                    <th>{'URL (Sandbox)'}</th>
                    <td>{endpoint.path}</td>
                </tr>
                <tr>
                    <th>{'URL (Production)'}</th>
                    <td>{endpoint.path.replace('sandbox-', '')}</td>
                </tr>
                <tr>
                    <th>{'Query String'}</th>
                    <td>{(endpoint.queryString) ? '?' : ''}{Object.keys(endpoint.queryString || {}).join('&')}</td>
                </tr>
                <tr>
                    <th>{'Response Type'}</th>
                    <td>{(endpoint.responseSchemaWithRefs && endpoint.responseSchemaWithRefs.schema.$ref) ?
                        <a href={`/{{page.modelsPath}}/${encodeURI(endpoint.responseSchemaWithRefs.schema.$ref.split('/').pop())}`}>
                            {endpoint.responseSchemaWithRefs.schema.$ref.split('/').pop()}
                        </a> : null}
                    </td>
                </tr>
                <tr>
                    <th>{'Content-Type'}</th>
                    <td>{endpoint.produces.join(', ')}</td>
                </tr>
            </thead>
        </table>
        <h3 id='description'>{'Description'}</h3>
        <ReactMarkdown source={endpoint.description} />
        <h3 id='parameters'>{'Parameters'}</h3>
        <table className='styled-table'>
            <thead>
                <tr>
                    <th>{'Location'}</th>
                    <th>{'Parameter'}</th>
                    <th>{'Attributes'}</th>
                    <th>{'Summary'}</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(endpoint.pathParams || {}).map((param) => {
                    return (<tr>
                        <td>{'UriPath'}</td>
                        <td>{param}</td>
                        <td>{(endpoint.pathParams[param].required) ? 'Required' : 'Optional'}{', '}{endpoint.pathParams[param].fieldType}</td>
                        <td><ReactMarkdown source={endpoint.pathParams[param].description} /></td>
                    </tr>);
                })}
                {Object.keys(endpoint.headerParams || {}).map((param) => {
                    return (<tr>
                        <td>{'Header'}</td>
                        <td>{param}</td>
                        <td>{(endpoint.headerParams[param].required) ? 'Required' : 'Optional'}{', '}{endpoint.headerParams[param].fieldType}</td>
                        <td><ReactMarkdown source={endpoint.headerParams[param].description} /></td>
                    </tr>);
                })}
                {Object.keys(endpoint.queryString || {}).map((param) => {
                    return (<tr>
                        <td>{'QueryString'}</td>
                        <td>{param}</td>
                        <td>{(endpoint.queryString[param].required) ? 'Required' : 'Optional'}{', '}{endpoint.queryString[param].fieldType}</td>
                        <td><ReactMarkdown source={endpoint.queryString[param].description} /></td>
                    </tr>);
                })}
                {(endpoint.requestSchemaWithRefs) ?
                    <tr>
                        <td>{'RequestBody'}</td>
                        <td>{endpoint.requestSchemaWithRefs.name}</td>
                        <td>{(endpoint.requestSchemaWithRefs.required) ? 'Required' : 'Optional'}{', '}{(endpoint.requestSchemaWithRefs.schema.$ref) ?
                            <a href={`/{{page.modelsPath}}/${encodeURI(endpoint.requestSchemaWithRefs.schema.$ref.split('/').pop())}`}>
                                {endpoint.requestSchemaWithRefs.schema.$ref.split('/').pop()}
                            </a> : null}
                        </td>
                        <td>{endpoint.requestSchemaWithRefs.description}</td>
                    </tr> : null
                }
            </tbody>
        </table>
    </div>
);

ApiDocumentation.displayName = 'API Documentation';
ApiDocumentation.propTypes = {
    endpoint: React.PropTypes.object
};

export default ApiDocumentation;
