import UserService from "../services/user.services.js";

export async function getUserProfile(req, res, err) {
    const { id } = req.params;

    let profile = {};
    let error;
    if (req.params?.id) {
        [profile, error] = await UserService.getOne({ id: id });
    } else {
        [profile, error] = await UserService.getAll();
    }

    if (error) {
        if (error.cause?.code == "UserDoesNotExist") {
            res.status(404).json(error);
            return;
        }

        res.status(500).json(error);
        return;
    }

    res.status(200).json(profile);
    return;
}

export async function addUser(req, res, err) {
    // should be able to add multiple users since the URI doesn't specify operation on one particular user
    // TODO: allow insertion of multiple users.
    const user = req.body.user;
    const [pid, error] = await UserService.addOne(user);
    if (error) {
        console.log(`error: ${error}`);

        res.status(400).json(error);
        return;
    }
    res.status(200).json(pid);
    return;
}

export async function editUser(req, res, err) {
    const data = {
        id: req.params.id,
        user: req.body.user
    };
    const [status, error] = await UserService.updateOne(data);
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).json(status);
    return;
}

export async function deleteUser(req, res, err) {
    const pid = req.params.id;
    const [status, error] = await UserService.deleteOne({ id: pid });
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).json(status);
    return;
}
