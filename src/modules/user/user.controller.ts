import {
	BadRequestException,
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {User} from "entities/user.entity";
import {isFileExtensionSafe, removeFile, saveImageToStorage} from "helpers/imageStorage";
import {join} from "path";

import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UserService} from "./user.service";

@Controller("me")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
	constructor(private readonly usersService: UserService) {}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOne(@Param("id") id: string): Promise<User> {
		return this.usersService.findById(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto);
	}

	@Post("upload/:id")
	@UseInterceptors(FileInterceptor("avatar", saveImageToStorage))
	@HttpCode(HttpStatus.CREATED)
	async upload(@UploadedFile() file: Express.Multer.File, @Param("id") id: string): Promise<User> {
		const filename = file?.filename;

		if (!filename) throw new BadRequestException("File must be a png, jpg/jpeg");

		const imagesFolderPath = join(process.cwd(), "files");
		const fullImagePath = join(imagesFolderPath + "/" + file.filename);
		if (await isFileExtensionSafe(fullImagePath)) {
			return this.usersService.updateUserImageId(id, filename);
		}
		removeFile(fullImagePath);
		throw new BadRequestException("File content does not match extension!");
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async remove(@Param("id") id: string): Promise<User> {
		return this.usersService.remove(id);
	}
}