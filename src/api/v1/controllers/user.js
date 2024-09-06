import UserService from "../services/user.js";

export async function getUsers(req, res, err) {
    let body = {};
    let error;
    if (req.params?.id) {
        [body, error] = await UserService.getOne({ id: req.params.id });
    } else {
        [body, error] = await UserService.getAll();
    }

    if (error) {
        if (error.cause?.code == "UserDoesNotExist") {
            res.status(404).send(error);
            return;
        }

        res.status(500).send(error);
        return;
    }

    res.status(200).send(body);
    return;
}

export async function addUser(req, res, err) {
    // should be able to add multiple users since the URI doesn't specify operation on one particular user
    // TODO: allow insertion of multiple users.
    const user = req.body.user;
    const [pid, error] = await UserService.addOne(user);
    if (error) {
        console.log(`error: ${error}`);

        res.status(400).send(error);
        return;
    }
    res.status(200).send(pid);
    return;
}

export async function editUser(req, res, err) {
    const data = {
        id: req.params.id,
        user: req.body.user
    };
    const [status, error] = await UserService.updateOne(data);
    if (error) {
        res.status(400).send(error);
        return;
    }
    res.status(200).send(status);
    return;
}

export async function deleteUser(req, res, err) {
    const pid = req.params.id;
    const [status, error] = await UserService.deleteOne({ id: pid });
    if (error) {
        res.status(400).send(error);
        return;
    }
    res.status(200).send(status);
    return;
}
