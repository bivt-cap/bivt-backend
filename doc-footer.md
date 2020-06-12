<hr />
<h1>Errors</h1>
<p>Default error Types for all endpoints</p>
<h2>Error 4xx</h2>
<table>
    <thead>
        <tr>
        <th style="width: 30%">Name</th>
        <th style="width: 10%">Type</th>
        <th style="width: 60%">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="code">BAD_REQUEST</td>
            <td>400</td>
            <td>
                <p>The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing.</p>
            </td>
        </tr>
        <tr>
            <td class="code">UNAUTHORIZED</td>
            <td>401</td>
            <td>
                <p>Authentication is required and has failed or has not yet been provided.</p>
            </td>
        </tr>
        <tr>
            <td class="code">NOT_FOUND</td>
            <td>404</td>
            <td>
                <p>The requested resource could not be found but may be available in the future.</p>
            </td>
        </tr>
        <tr>
            <td class="code">CONFLICT</td>
            <td>409</td>
            <td>
                <p>Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.</p>
            </td>
        </tr>
        <tr>
            <td class="code">UNPROCESSABLE_ENTITY</td>
            <td>422</td>
            <td>
                <p>The request was well-formed but was unable to be followed due to  semantic errors.</p>
            </td>
        </tr>
    </tbody>
</table>
<h2>Error 5xx</h2>
<table>
    <thead>
        <tr>
            <th style="width: 30%">Name</th>
            <th style="width: 10%">Type</th>
            <th style="width: 60%">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="code">INTERNAL_SERVER_ERROR</td>
            <td>500</td>
            <td>
                <p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>
            </td>
        </tr>
    </tbody>
</table>

<ul class="nav nav-tabs nav-tabs-examples">
    <li class="active"><a href="javascript:void(0);">Example</a></li>
</ul>

<div class="tab-content">
    <div class="tab-pane active">
        	<pre class="prettyprint language-json" data-type="json">
            <code>
HTTP/1.1 400 Bad Request
{
    "status": {
        "errors": [
            "Bad Request",
        ],
        "id": 400
    }
}
            </code>
        </pre>
        <pre class="prettyprint language-json" data-type="json">
            <code>
HTTP/1.1 401 Unauthorized
{
    "status": {
        "errors": [
            "Unauthorized",
        ],
        "id": 401
    }
}
            </code>
        </pre>
        <pre class="prettyprint language-json" data-type="json">
            <code>
HTTP/1.1 404 Not Found
{
    "status": {
        "errors": [
            "Not Found",
        ],
        "id": 404
    }
}
            </code>
        </pre>
        <pre class="prettyprint language-json" data-type="json">
            <code>
HTTP/1.1 409 Conflict
{
    "status": {
        "errors": [
            "Conflict",
        ],
        "id": 409
    }
}
            </code>
        </pre>
        <pre class="prettyprint language-json" data-type="json">
            <code>
HTTP/1.1 422 Unprocessable Entity
{
    "status": {
        "errors": [
            "Id is required",
        ],
        "id": 422
    }
}
            </code>
        </pre>
        <pre class="prettyprint language-json" data-type="json">
            <code>
HTTP/1.1 500 Internal Server Error
{
    "status": {
        "errors": [
            "Internal Server Error",
        ],
        "id": 500
    }
}
            </code>
        </pre>
    </div>
</div>
