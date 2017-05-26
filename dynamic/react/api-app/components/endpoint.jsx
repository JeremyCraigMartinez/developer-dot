import React from 'react';
import ApiConsole from '../../shared/components/apiConsole';
import ExpanderIcon from './expanderIcon';
import url from 'url';

const replaceSpaces = (str) => str.replace(/\s/g, '');

// Give our endpoint an id based on its name for our clientside routing in jekyll
const EndPointComponent = ({endpoint, apiType, onFillConsoleSampleData, onSubmitConsoleRequest, onPostBodyInputChanged, onResetConsole, onQueryParamChanged, onPathParamChanged, onAddItemToPostbodyCollection, onRemovePostbodyCollectionItem, onToggleShowExcludedPostBodyProps}) => (
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
                        <a href='#'>{endpoint.responseSchemaWithRefs.schema.$ref.split('/').pop()}</a> : null
                    }</td>
                </tr>
                <tr>
                    <th>{'Content-Type'}</th>
                    <td>{endpoint.produces.join(', ')}</td>
                </tr>
            </thead>
        </table>
        <h3 id='description'>{'Description'}</h3>
        <p>{endpoint.description}</p>
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
                        <td>{endpoint.pathParams[param].description}</td>
                    </tr>);
                })}
                {Object.keys(endpoint.headerParams || {}).map((param) => {
                    return (<tr>
                        <td>{'Header'}</td>
                        <td>{param}</td>
                        <td>{(endpoint.headerParams[param].required) ? 'Required' : 'Optional'}{', '}{endpoint.headerParams[param].fieldType}</td>
                        <td>{endpoint.headerParams[param].description}</td>
                    </tr>);
                })}
                {Object.keys(endpoint.queryString || {}).map((param) => {
                    return (<tr>
                        <td>{'QueryString'}</td>
                        <td>{param}</td>
                        <td>{(endpoint.queryString[param].required) ? 'Required' : 'Optional'}{', '}{endpoint.queryString[param].fieldType}</td>
                        <td>{endpoint.queryString[param].description}</td>
                    </tr>);
                })}
                {(endpoint.requestSchemaWithRefs) ?
                    <tr>
                        <td>{'RequestBody'}</td>
                        <td>{endpoint.requestSchemaWithRefs.name}</td>
                        <td>{(endpoint.requestSchemaWithRefs.required) ? 'Required' : 'Optional'}{', '}{(endpoint.requestSchemaWithRefs.schema.$ref) ? <a href='#'>{endpoint.requestSchemaWithRefs.schema.$ref.split('/').pop()}</a> : null}</td>
                        <td>{endpoint.requestSchemaWithRefs.description}</td>
                    </tr> : null
                }
            </tbody>
        </table>
        <br />
        {apiType === 'REST' ?
            <div>
                <div className={'try-it-now-header'} data-target={`#${replaceSpaces(endpoint.operationId)}-console-body`} data-toggle={'collapse'} id={`${replaceSpaces(endpoint.operationId)}-console`} onClick={
                    () => {
                        $(`#${replaceSpaces(endpoint.operationId)}-console-icon`).toggleClass('rotate');
                        const intervalId = setInterval(() => {
                            $('#the-nav').affix('checkPosition');
                        }, 20);

                        setTimeout(() => clearInterval(intervalId), 350);
                    }
                }>
                    <div className={'documentation-expand-icon'} id={`${replaceSpaces(endpoint.operationId)}-console-icon`} style={{display: 'inline-block', marginRight: '5px'}}>
                        <ExpanderIcon startPosition={'DOWN'}/>
                    </div>
                    <h5 className={'clickable'} style={{display: 'inline-block'}}>{'Try ' + endpoint.name + ' now!'}</h5>
                </div>
                <div className={'collapse'} id={`${replaceSpaces(endpoint.operationId)}-console-body`}>
                    <ApiConsole endpoint={endpoint} onAddItemToPostbodyCollection={onAddItemToPostbodyCollection} onFillConsoleSampleData={onFillConsoleSampleData} onPathParamChanged={onPathParamChanged} onPostBodyInputChanged={onPostBodyInputChanged} onQueryParamChanged={onQueryParamChanged} onRemovePostbodyCollectionItem={onRemovePostbodyCollectionItem} onResetConsole={onResetConsole} onSubmitConsoleRequest={onSubmitConsoleRequest} onToggleShowExcludedPostBodyProps={onToggleShowExcludedPostBodyProps} showExcludedPostBodyFields={endpoint.showExcludedPostBodyFields}/>
                </div>
            </div> : null}
    </div>
);

EndPointComponent.displayName = 'Api Endpoint';

EndPointComponent.propTypes = {
    apiType: React.PropTypes.oneOf(['REST', 'SOAP']).isRequired,
    endpoint: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        description: React.PropTypes.string.isRequired,
        curl: React.PropTypes.string.isRequired,
        sampleAuthHeader: React.PropTypes.string,
        path: React.PropTypes.string.isRequired,
        action: React.PropTypes.string.isRequired,
        queryString: React.PropTypes.objectOf(
            React.PropTypes.shape({
                description: React.PropTypes.string,
                example: React.PropTypes.any,
                required: React.PropTypes.bool,
                value: React.PropTypes.any.isRequired
            })
        ),
        pathParams: React.PropTypes.objectOf(
            React.PropTypes.shape({
                description: React.PropTypes.string,
                example: React.PropTypes.any,
                required: React.PropTypes.bool,
                value: React.PropTypes.any.isRequired
            })
        ),
        postBody: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
        requestSchema: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
        responseSchema: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
        showExcludedPostBodyFields: React.PropTypes.bool.isRequired,
        apiResponse: React.PropTypes.shape({
            status: React.PropTypes.string.isRequired,
            statusMessage: React.PropTypes.string.isRequired,
            body: React.PropTypes.oneOfType([
                React.PropTypes.object, React.PropTypes.array
            ]).isRequired
        })
    }).isRequired,
    onAddItemToPostbodyCollection: React.PropTypes.func.isRequired,
    onFillConsoleSampleData: React.PropTypes.func.isRequired,
    onPathParamChanged: React.PropTypes.func.isRequired,
    onPostBodyInputChanged: React.PropTypes.func.isRequired,
    onQueryParamChanged: React.PropTypes.func.isRequired,
    onRemovePostbodyCollectionItem: React.PropTypes.func.isRequired,
    onResetConsole: React.PropTypes.func.isRequired,
    onSubmitConsoleRequest: React.PropTypes.func.isRequired,
    onToggleShowExcludedPostBodyProps: React.PropTypes.func.isRequired,
    sampleContentType: React.PropTypes.array
};

export default EndPointComponent;
